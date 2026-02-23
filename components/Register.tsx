import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Input } from './ui/Input';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement registration logic
      console.log('Registering:', { firstName, lastName, email, phone });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Kayıt işlemi veritabanı bağlandığında aktif olacaktır.');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

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
