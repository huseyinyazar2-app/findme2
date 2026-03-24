

import { turso } from './turso';
import { UserProfile, PetProfile } from '../types';
import { generateUUID } from '../constants';

// Export turso for direct use if needed
export { turso as supabase }; // Kept alias for compatibility if used elsewhere

// --- LOGGING OPERATION ---

/**
 * QR taramasını ve (varsa) konum bilgisini tek seferde kaydeder.
 * Location null gelse bile IP ve Cihaz bilgisini kaydeder.
 * IP servisi yanıt vermezse kayıt işlemini engellemez.
 */
export const logQrScan = async (shortCode: string, locationData?: {lat: number, lng: number, accuracy: number} | null): Promise<string | null> => {
    try {
        console.log(`📡 Loglama başlatılıyor: ${shortCode}`);

        // 1. CİHAZ BİLGİLERİ
        const userAgent = navigator.userAgent || 'unknown';
        const platform = navigator.platform || 'unknown';
        const language = navigator.language || 'unknown';
        
        const deviceInfo = {
            userAgent: userAgent,
            platform: platform,
            language: language,
            screen: {
                width: typeof window !== 'undefined' ? window.screen.width : 0,
                height: typeof window !== 'undefined' ? window.screen.height : 0
            },
            timestamp_local: new Date().toString()
        };

        // 2. IP ve IP-TABANLI KONUM ALMA
        // ipify yerine ipwho.is kullanıyoruz (Hem IP hem Lat/Lng veriyor)
        let ipAddress = '0.0.0.0';
        let ipLocationData = null;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3sn bekle

            const ipRes = await fetch('https://ipwho.is/', { 
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' }
            });
            clearTimeout(timeoutId);
            
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                if (ipData.success) {
                    ipAddress = ipData.ip;
                    // IP'den gelen yaklaşık konum verisi
                    ipLocationData = {
                        lat: ipData.latitude,
                        lng: ipData.longitude,
                        city: ipData.city,
                        country: ipData.country,
                        source: 'IP', // Kaynağı belirtiyoruz
                        accuracy: 5000 // IP konumları genelde geniş çaplıdır (5km varsayalım)
                    };
                } else {
                    // Servis hata dönerse (Rate limit vb.)
                    ipAddress = ipData.ip || '0.0.0.0'; 
                }
            }
        } catch (e) {
            console.warn("IP/Konum servisi yanıt vermedi:", e);
        }

        // 3. KONUM VERİSİNİ BELİRLE (GPS Öncelikli, Yoksa IP)
        let finalLocation = null;

        if (locationData) {
            // Kullanıcı GPS izni verdiyse kesin konumu kullan
            finalLocation = {
                ...locationData,
                source: 'GPS'
            };
        } else if (ipLocationData) {
            // GPS yoksa IP konumunu kullan
            finalLocation = ipLocationData;
        }

        // 4. PAYLOAD HAZIRLA
        const logPayload = {
            qr_code: shortCode,
            ip_address: ipAddress,
            user_agent: userAgent, 
            device_info: deviceInfo,
            location: finalLocation, // GPS veya IP konumu
            consent_given: !!locationData // Sadece GPS verildiyse rıza var sayılır
        };

        // 5. TURSO INSERT
        const id = generateUUID();
        const { rowsAffected } = await turso.execute({
            sql: `INSERT INTO QR_Logs (id, qr_code, ip_address, user_agent, device_info, location, consent_given) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, 
                shortCode, 
                ipAddress, 
                userAgent, 
                JSON.stringify(deviceInfo), 
                JSON.stringify(finalLocation), 
                locationData ? 1 : 0
            ]
        });

        if (rowsAffected === 0) {
            console.error("❌ Log kaydetme hatası (Turso)");
            return null;
        } else {
            console.log("✅ QR Logu başarıyla kaydedildi. ID:", id);
            return id;
        }

    } catch (err: any) {
        console.error("Loglama sistemi genel hatası:", err);
        return null;
    }
};

/**
 * QR_Logs tablosundan belirli bir QR kod için son logları çeker.
 * Genellikle sahip giriş yaptığında gösterilir.
 */
export const getRecentQrScans = async (qrCode: string) => {
    try {
        // Son 10 taramayı getir, en yeni en üstte
        const res = await turso.execute({
            sql: `SELECT * FROM QR_Logs WHERE qr_code = ? ORDER BY scanned_at DESC LIMIT 10`,
            args: [qrCode]
        });

        return res.rows.map(row => ({
            ...row,
            device_info: JSON.parse((row.device_info as string) || '{}'),
            location: JSON.parse((row.location as string) || 'null'),
            consent_given: row.consent_given === 1
        }));
    } catch (e) {
        console.error("getRecentQrScans hatası:", e);
        return [];
    }
};

// --- QR Operations ---

export const checkQRCode = async (shortCode: string) => {
    // TABLO ADI: QR_Kod
    try {
        const res = await turso.execute({
            sql: `SELECT short_code, pin, status FROM QR_Kod WHERE short_code = ?`,
            args: [shortCode]
        });

        if (res.rows.length === 0) {
            return { valid: false, message: 'Geçersiz QR Kod' };
        }

        const qrData = res.rows[0];

        return { 
            valid: true, 
            status: qrData.status as string, // 'boş' veya 'dolu'
            shortCode: qrData.short_code as string,
            pin: qrData.pin as string
        };
    } catch (e) {
        console.error("checkQRCode error:", e);
        return { valid: false, message: 'Veritabanı hatası' };
    }
};

/**
 * Fetches public pet info + lost status without requiring a PIN.
 * Used for the "Finder View" when a pet is lost.
 */
export const getPublicPetByQr = async (shortCode: string): Promise<PetProfile | null> => {
    try {
        // 1. Find the user associated with this QR code
        const userRes = await turso.execute({
            sql: `SELECT id, username FROM Find_Users WHERE qr_code = ?`,
            args: [shortCode]
        });

        if (userRes.rows.length === 0) {
            return null;
        }
        const userData = userRes.rows[0];

        // 2. Get the pet associated with this user
        const petRes = await turso.execute({
            sql: `SELECT * FROM Find_Pets WHERE owner_id = ?`,
            args: [userData.id]
        });

        if (petRes.rows.length === 0) {
            return null;
        }
        const petData = petRes.rows[0];

        // 3. Return the profile
        return {
            id: petData.id as string,
            ...JSON.parse(petData.pet_data as string),
            lostStatus: JSON.parse(petData.lost_status as string),
            ownerUsername: userData.username as string
        } as PetProfile;
    } catch (e) {
        console.error("getPublicPetByQr error:", e);
        return null;
    }
};

// --- Storage Operations ---

export const uploadPetPhoto = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_DIMENSION = 800; // Akıllı sıkıştırma boyutu

                if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.7 quality and convert to base64
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = () => {
                console.error("Resim yüklenirken hata oluştu");
                resolve(null);
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            console.error("Dosya okunurken hata oluştu");
            resolve(null);
        };
        reader.readAsDataURL(file);
    });
};

// --- Auth & User Operations ---

export const loginOrRegister = async (identifier: string, inputPin: string): Promise<{ success: boolean; user?: UserProfile; error?: string; isNew?: boolean }> => {
    try {
        const isEmail = identifier.includes('@');

        if (isEmail) {
            // E-posta ile giriş
            const userRes = await turso.execute({
                sql: `SELECT * FROM Find_Users WHERE email = ?`,
                args: [identifier]
            });

            if (userRes.rows.length === 0) {
                return { success: false, error: 'E-posta adresi bulunamadı.' };
            }

            const existingUser = userRes.rows[0];
            const dbPassword = String(existingUser.password).trim();
            const userPin = String(inputPin).trim();

            if (dbPassword !== userPin) {
                return { success: false, error: 'Hatalı Şifre/PIN Kodu' };
            }

            const profile = mapDbUserToProfile(existingUser);
            return { success: true, user: profile, isNew: false };
        } else {
            // QR Kod ile giriş
            const shortCode = identifier;
            // 1. ADIM: QR_Kod tablosundan PIN ve STATUS doğrula
            const qrRes = await turso.execute({
                sql: `SELECT * FROM QR_Kod WHERE short_code = ?`,
                args: [shortCode]
            });

            if (qrRes.rows.length === 0) {
                return { success: false, error: 'Geçersiz QR Kod' };
            }

            const qrData = qrRes.rows[0];
            const dbPin = String(qrData.pin).trim();
            const userPin = String(inputPin).trim();

            if (dbPin !== userPin) {
                return { success: false, error: 'Hatalı PIN Kodu' };
            }

            // 2. ADIM: Status'a göre işlem yap
            if (qrData.status === 'boş') {
                const tempUser = createTempProfile(shortCode, userPin);
                return { success: true, user: tempUser, isNew: true };
            
            } else {
                const userRes = await turso.execute({
                    sql: `SELECT * FROM Find_Users WHERE qr_code = ?`,
                    args: [shortCode]
                });

                if (userRes.rows.length > 0) {
                    const existingUser = userRes.rows[0];
                    const profile = mapDbUserToProfile(existingUser);
                    if (!profile.password || profile.password.trim() === '') {
                        profile.password = dbPin;
                    }
                    return { success: true, user: profile, isNew: false };
                } else {
                    // Hatalı durum düzeltme
                    await turso.execute({
                        sql: `UPDATE QR_Kod SET status = 'boş' WHERE short_code = ?`,
                        args: [shortCode]
                    });
                    const tempUser = createTempProfile(shortCode, userPin);
                    return { success: true, user: tempUser, isNew: true };
                }
            }
        }
    } catch (e: any) {
        console.error("Auth hatası:", e);
        return { success: false, error: `Sunucu hatası: ${e.message}` };
    }
};

export const registerUserAfterForm = async (userProfile: UserProfile, shortCode: string): Promise<boolean> => {
    try {
        const dbUser = mapProfileToDbUser(userProfile);
        dbUser.qr_code = shortCode; 
        dbUser.id = generateUUID();

        await turso.execute({
            sql: `INSERT INTO Find_Users (id, username, qr_code, password, full_name, email, phone, is_email_verified, contact_preference, emergency_contact_name, emergency_contact_email, emergency_contact_phone, city, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                dbUser.id, dbUser.username, dbUser.qr_code, dbUser.password, dbUser.full_name, dbUser.email, dbUser.phone,
                dbUser.is_email_verified ? 1 : 0, dbUser.contact_preference, dbUser.emergency_contact_name, dbUser.emergency_contact_email, dbUser.emergency_contact_phone, dbUser.city, dbUser.district
            ]
        });

        await turso.execute({
            sql: `UPDATE QR_Kod SET status = 'dolu' WHERE short_code = ?`,
            args: [shortCode]
        });
        return true;
    } catch (e) {
        console.error("registerUserAfterForm error", e);
        return false;
    }
}

export const updateUserProfile = async (user: UserProfile) => {
    try {
        const dbData = mapProfileToDbUser(user);

        await turso.execute({
            sql: `UPDATE Find_Users SET full_name = ?, email = ?, phone = ?, contact_preference = ?, emergency_contact_name = ?, emergency_contact_email = ?, emergency_contact_phone = ?, city = ?, district = ? WHERE username = ?`,
            args: [
                dbData.full_name, dbData.email, dbData.phone, dbData.contact_preference, dbData.emergency_contact_name, dbData.emergency_contact_email, dbData.emergency_contact_phone, dbData.city, dbData.district, dbData.username
            ]
        });

        if (user.password) {
            await turso.execute({
                sql: `UPDATE QR_Kod SET pin = ? WHERE short_code = ?`,
                args: [user.password, user.username]
            });
            await turso.execute({
                sql: `UPDATE Find_Users SET password = ? WHERE username = ?`,
                args: [user.password, user.username]
            });
        }
        return true;
    } catch (e) {
        console.error("updateUserProfile error", e);
        return false;
    }
};

// --- Pet Operations ---

export const getPetForUser = async (username: string): Promise<PetProfile | null> => {
    try {
        const userRes = await turso.execute({
            sql: `SELECT id FROM Find_Users WHERE username = ?`,
            args: [username]
        });
        if (userRes.rows.length === 0) return null;
        const user = userRes.rows[0];

        const petRes = await turso.execute({
            sql: `SELECT * FROM Find_Pets WHERE owner_id = ?`,
            args: [user.id]
        });

        if (petRes.rows.length > 0) {
            const pet = petRes.rows[0];
            return {
                id: pet.id as string,
                ...JSON.parse(pet.pet_data as string),
                lostStatus: JSON.parse(pet.lost_status as string)
            } as PetProfile;
        }
        return null;
    } catch (e) {
        console.error("getPetForUser error", e);
        return null;
    }
};

export const savePetForUser = async (user: UserProfile, pet: PetProfile) => {
    try {
        const userRes = await turso.execute({
            sql: `SELECT id FROM Find_Users WHERE username = ?`,
            args: [user.username]
        });
        
        let ownerId = userRes.rows.length > 0 ? userRes.rows[0].id : null;

        if (!ownerId) {
            const success = await registerUserAfterForm(user, user.username);
            if (!success) return false;
            
            const newUserRes = await turso.execute({
                sql: `SELECT id FROM Find_Users WHERE username = ?`,
                args: [user.username]
            });
            if (newUserRes.rows.length === 0) return false;
            ownerId = newUserRes.rows[0].id;
        }

        const petDataJson = JSON.stringify({
            name: pet.name,
            type: pet.type,
            photoUrl: pet.photoUrl,
            features: pet.features,
            sizeInfo: pet.sizeInfo,
            temperament: pet.temperament,
            healthWarning: pet.healthWarning,
            microchip: pet.microchip,
            vetInfo: pet.vetInfo
        });
        
        const lostStatusJson = JSON.stringify(pet.lostStatus);

        const existingPetRes = await turso.execute({
            sql: `SELECT id FROM Find_Pets WHERE owner_id = ?`,
            args: [ownerId]
        });

        if (existingPetRes.rows.length > 0) {
            const existingPetId = existingPetRes.rows[0].id;
            await turso.execute({
                sql: `UPDATE Find_Pets SET pet_data = ?, lost_status = ? WHERE id = ?`,
                args: [petDataJson, lostStatusJson, existingPetId]
            });
            return true;
        } else {
            const newPetId = generateUUID();
            await turso.execute({
                sql: `INSERT INTO Find_Pets (id, owner_id, pet_data, lost_status) VALUES (?, ?, ?, ?)`,
                args: [newPetId, ownerId, petDataJson, lostStatusJson]
            });
            return true;
        }
    } catch (e) {
        console.error("savePetForUser error", e);
        return false;
    }
};


// --- Helpers ---

function createTempProfile(username: string, pin: string): UserProfile {
    return {
        username: username,
        password: pin, 
        email: '',
        isEmailVerified: false,
        contactPreference: 'Telefon' as any,
        city: '',
        district: ''
    };
}

function mapDbUserToProfile(dbUser: any): UserProfile {
    return {
        username: dbUser.username,
        password: dbUser.password, 
        fullName: dbUser.full_name,
        email: dbUser.email,
        phone: dbUser.phone,
        isEmailVerified: dbUser.is_email_verified || false,
        contactPreference: dbUser.contact_preference as any,
        emergencyContactName: dbUser.emergency_contact_name,
        emergencyContactEmail: dbUser.emergency_contact_email,
        emergencyContactPhone: dbUser.emergency_contact_phone,
        city: dbUser.city,
        district: dbUser.district
    };
}

function mapProfileToDbUser(profile: UserProfile): any {
    return {
        username: profile.username,
        password: profile.password,
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        is_email_verified: profile.isEmailVerified,
        contact_preference: profile.contactPreference,
        emergency_contact_name: profile.emergencyContactName,
        emergency_contact_email: profile.emergencyContactEmail,
        emergency_contact_phone: profile.emergencyContactPhone,
        city: profile.city,
        district: profile.district
    };
}
