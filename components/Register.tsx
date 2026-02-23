import React, { useState, useRef } from 'react';
import { Loader2, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { Input } from './ui/Input';
import { supabase } from '../services/dbService';
import { QRCodeSVG } from 'qrcode.react';

interface RegisterProps {
  onBackToLogin: () => void;
  onBackToHome?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBackToLogin, onBackToHome }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ shortCode: string; pin: string } | null>(null);
  const qrRef = useRef<SVGSVGElement>(null);

  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Check if email already exists
      const { data: existingUser } = await supabase
        .from('Find_Users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Bu e-posta adresi ile zaten kayıtlı bir kullanıcı var.');
      }

      // 2. Generate unique short code starting with 'S'
      let shortCode = '';
      let isUnique = false;
      while (!isUnique) {
        shortCode = 'S' + generateRandomString(6);
        const { data: existingCode } = await supabase
          .from('QR_Kod')
          .select('short_code')
          .eq('short_code', shortCode)
          .single();
        if (!existingCode) {
          isUnique = true;
        }
      }

      // 3. Generate PIN
      const pin = generateRandomPin();

      // 4. Create QR_Kod entry
      const { error: qrError } = await supabase
        .from('QR_Kod')
        .insert([{ short_code: shortCode, pin: pin, status: 'dolu' }]);

      if (qrError) throw new Error('QR Kod oluşturulurken bir hata oluştu.');

      // 5. Create Find_Users entry
      const userPayload = {
        username: shortCode,
        password: pin,
        full_name: `${firstName} ${lastName}`.trim(),
        email: email,
        phone: phone,
        qr_code: shortCode,
        is_email_verified: false,
        contact_preference: 'Telefon',
        created_at: new Date().toISOString()
      };

      const { error: userError } = await supabase
        .from('Find_Users')
        .insert([userPayload]);

      if (userError) {
        // Rollback QR_Kod if user creation fails
        await supabase.from('QR_Kod').delete().eq('short_code', shortCode);
        throw new Error('Kullanıcı oluşturulurken bir hata oluştu.');
      }

      // Success! Show the QR code screen
      setSuccessData({ shortCode, pin });

    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `FindMe_${successData?.shortCode}.png`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (successData) {
      const qrUrl = `https://findme.mom/pet/${successData.shortCode}`;
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-slate-50 dark:bg-matrix-950">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/50 dark:bg-green-900/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="w-full max-w-sm relative z-10">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Kayıt Başarılı!</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    Dijital künyeniz oluşturuldu. Bu QR kodu indirip etiket bastırarak tasmanıza takıp kullanabilirsiniz.
                </p>

                <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6 flex justify-center">
                    <QRCodeSVG 
                        value={qrUrl} 
                        size={200} 
                        level="H"
                        includeMargin={true}
                        ref={qrRef}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Künye Kodu</p>
                        <p className="font-mono font-bold text-slate-800 dark:text-white">{successData.shortCode}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Giriş Şifreniz</p>
                        <p className="font-mono font-bold text-slate-800 dark:text-white">{successData.pin}</p>
                    </div>
                </div>

                <button 
                    onClick={handleDownloadQR}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
                >
                    <Download size={18} /> QR Kodu İndir
                </button>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl mb-6">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                        Lütfen sisteme giriş yapıp dostunuzun bilgilerini girmeyi unutmayın.
                    </p>
                </div>

                <button 
                    onClick={onBackToLogin}
                    className="w-full py-4 bg-matrix-600 hover:bg-matrix-700 text-white font-bold rounded-xl shadow-lg shadow-matrix-500/30 transition-all active:scale-[0.98]"
                >
                    Sisteme Giriş Yap
                </button>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-slate-50 dark:bg-matrix-950">
      
      {/* Ambient Background Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-matrix-200/50 dark:bg-matrix-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        
        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8">
            
            {/* Header / Logo */}
            <div className="mb-8 text-center flex flex-col items-center">
                <div className="w-24 h-24 mb-4 drop-shadow-lg">
                    <img 
                        src="/logo.png" 
                        alt="MatrixC Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            // Fallback if logo fails
                            const parent = e.currentTarget.parentElement;
                            if(parent) parent.innerHTML = '<div class="w-20 h-20 bg-matrix-100 rounded-2xl flex items-center justify-center text-matrix-600 font-bold">Logo</div>'
                        }}
                    />
                </div>
                
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-1">
                    FindMe<span className="text-matrix-600">.mom</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Yeni Hesap Oluştur
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Ad"
                        type="text"
                        placeholder="Adınız"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <Input
                        label="Soyad"
                        type="text"
                        placeholder="Soyadınız"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <Input
                    label="E-posta"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Telefon"
                    type="tel"
                    placeholder="0555 555 55 55"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-matrix-600 to-matrix-700 hover:from-matrix-500 hover:to-matrix-600 text-white font-bold rounded-xl shadow-lg shadow-matrix-500/30 dark:shadow-matrix-900/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Kayıt Ol'}
                </button>
            </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Ana sayfaya dön
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
