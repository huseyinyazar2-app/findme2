
================================================================================
MATRIXC FIND ME - VERİTABANI VE ENTEGRASYON DOKÜMANTASYONU
================================================================================

Bu doküman, MatrixC Find Me uygulamasının Supabase üzerinde çalışan veritabanı 
yapısını, tablolar arası ilişkileri ve dış sistemlerin QR kod üretimi için 
bilmesi gereken teknik detayları içerir.

Veritabanı Platformu: PostgreSQL (Supabase)

--------------------------------------------------------------------------------
1. TABLO: QR_Kod
--------------------------------------------------------------------------------
Açıklama: Fiziksel etiketlerin (QR Tag) ana envanter tablosudur. 
QR kod üretici yazılım öncelikle buraya kayıt atmalıdır.

Alanlar (Columns):
- short_code (TEXT, Primary Key): 
  Etiketin üzerindeki benzersiz kod (Örn: MTRX01). 
  Bu alan sistemin ana anahtarıdır.
  
- pin (TEXT): 
  Kullanıcının etiketi ilk kez aktif ederken girmesi gereken güvenlik kodu (Örn: 123456).
  Daha sonra kullanıcı şifresini değiştirirse burası da senkronize güncellenir.
  
- status (TEXT): 
  Etiketin durumu. İki değer alır:
  1. 'boş'  -> Etiket üretildi ama henüz bir kullanıcı sahiplenmedi. (Kayıt ekranı açılır)
  2. 'dolu' -> Etiket bir kullanıcıya atandı. (Giriş/Profil ekranı açılır)
  
- full_url (TEXT, Opsiyonel): 
  QR kodun tarandığında gittiği tam URL (Örn: https://matrixc.app/qr/MTRX01).

--------------------------------------------------------------------------------
2. TABLO: Find_Users
--------------------------------------------------------------------------------
Açıklama: Evcil hayvan sahiplerinin profil bilgilerini tutar.

Alanlar (Columns):
- id (UUID, Primary Key): 
  Otomatik üretilen benzersiz kullanıcı ID'si.

- username (TEXT, Unique): 
  QR_Kod tablosundaki 'short_code' ile aynıdır. Kullanıcı adı olarak QR ID kullanılır.

- qr_code (TEXT): 
  QR_Kod tablosuna referans (Foreign Key mantığıyla çalışır).

- password (TEXT): 
  Kullanıcının giriş şifresidir. Başlangıçta QR PIN ile aynıdır.

- full_name (TEXT): Kullanıcı Adı Soyadı.
- email (TEXT): Kullanıcı E-posta adresi.
- phone (TEXT): Kullanıcı Telefon numarası.
- is_email_verified (BOOLEAN): E-posta doğrulama durumu.

- contact_preference (TEXT): 
  Kayıp durumunda iletişim tercihi. Değerler: 'E-posta', 'Telefon', 'Her İkisi'.

- emergency_contact_name (TEXT): Yedek kişi ismi.
- emergency_contact_email (TEXT): Yedek kişi e-postası.
- emergency_contact_phone (TEXT): Yedek kişi telefonu.

- city (TEXT): İl bilgisi.
- district (TEXT): İlçe bilgisi.
- created_at (TIMESTAMPTZ): Kayıt tarihi.

--------------------------------------------------------------------------------
3. TABLO: Find_Pets
--------------------------------------------------------------------------------
Açıklama: Evcil hayvanların detaylarını ve anlık kayıp durumlarını tutar.
ÖNEMLİ: Bu tablo esneklik sağlamak amacıyla JSONB veri tipi kullanır.

Alanlar (Columns):
- id (UUID, Primary Key): Kayıt ID'si.
- owner_id (UUID): Find_Users tablosundaki 'id' alanına Foreign Key (Bağlı olduğu sahip).

- pet_data (JSONB): 
  Hayvanın tüm profil bilgilerini tutan JSON objesidir. 
  Yapısı şöyledir:
  {
    "name": { "value": "Pamuk", "isPublic": true },      // Adı ve Gizlilik Ayarı
    "type": "Kedi",                                      // Türü (Kedi, Köpek, vb.)
    "photoUrl": { "value": "https://...", "isPublic": true }, // Fotoğraf Linki
    "features": { "value": "Tekir", "isPublic": true },  // Renk/Özellik
    "sizeInfo": { "value": "3kg", "isPublic": true },    // Boy/Kilo
    "temperament": { "value": "Uysal", "isPublic": true }, // Huy
    "healthWarning": { "value": "Yok", "isPublic": true }, // Sağlık Uyarısı
    "vetInfo": { "value": "0212...", "isPublic": true },   // Veteriner Tel
    "microchip": "123456789"                             // Çip No (Daima gizlidir)
  }
  * Not: 'isPublic': true olan alanlar QR tarandığında herkese gösterilir.

- lost_status (JSONB): 
  Hayvanın kayıp durumunu ve konumunu tutan JSON objesidir.
  Yapısı şöyledir:
  {
    "isActive": true,                 // true = KAYIP MODU AKTİF (Alarm), false = GÜVENDE
    "message": "Lütfen arayın...",    // Sahibinin notu
    "lostDate": "2024-03-20T10:00...", // Kaybolma tarihi (ISO String)
    "lastSeenLocation": {             // Son görülen konum (Harita için)
       "lat": 39.9334,
       "lng": 32.8597
    }
  }

--------------------------------------------------------------------------------
4. STORAGE (DOSYA DEPOLAMA)
--------------------------------------------------------------------------------
Bucket Adı: pet_photos
Açıklama: Evcil hayvan fotoğraflarının yüklendiği Supabase Storage alanı.
İzinler: Public (Okuma herkese açık), Yazma (Sadece yetkili kullanıcı).

--------------------------------------------------------------------------------
ENTEGRASYON SENARYOSU (QR KOD ÜRETİCİ YAZILIM İÇİN)
--------------------------------------------------------------------------------

1. Adım (Üretim):
   Dış yazılım, fiziksel etiketi basmadan önce 'QR_Kod' tablosuna bir satır eklemelidir.
   INSERT INTO "QR_Kod" (short_code, pin, status) VALUES ('MTRX99', '123456', 'boş');

2. Adım (Kullanıcı İşlemi):
   Kullanıcı etiketi satın alır ve telefonla okutur.
   Uygulama 'MTRX99' kodunu sorgular. Status='boş' olduğu için kayıt ekranını açar.
   Kullanıcı '123456' PIN kodunu girerek kaydını tamamlar.

3. Adım (Aktivasyon):
   Kayıt tamamlandığında Web Uygulaması;
   - 'Find_Users' tablosuna kullanıcıyı ekler.
   - 'Find_Pets' tablosuna hayvanı ekler.
   - 'QR_Kod' tablosundaki status alanını 'dolu' olarak günceller.

--------------------------------------------------------------------------------
NOTLAR
--------------------------------------------------------------------------------
- "Find_Pets" tablosundan veri çekerken JSON parse işlemi yapılmalıdır.
- "qr_code" alanı tablolar arası ana bağlantı noktasıdır.
