
import React, { useState, useEffect } from 'react';
import { Loader2, KeyRound, Send, X, AlertCircle } from 'lucide-react';
import { Input } from './ui/Input';
import { sendMessageToAdmin } from '../services/dbService';

interface LoginProps {
  onLogin: (username: string, pass: string) => Promise<void>;
  initialUsername?: string;
  qrStatusMessage?: string;
  onRegisterClick?: () => void;
  onBackToHome?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, initialUsername, qrStatusMessage, onRegisterClick, onBackToHome }) => {
  const [username, setUsername] = useState(initialUsername || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (initialUsername) {
        setUsername(initialUsername);
    }
  }, [initialUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(username, password);
    } catch (err: any) {
      setError(err.message || 'Giriş veya doğrulama başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotUsername && !forgotEmail) {
      setError('Lütfen kullanıcı adı veya e-posta adresinizi girin.');
      return;
    }
    setForgotLoading(true);
    setError('');
    const success = await sendMessageToAdmin(
      null, 
      forgotUsername, 
      forgotEmail, 
      'Şifre Sıfırlama Talebi', 
      `Kullanıcı şifresini unuttuğunu bildirdi.\nKullanıcı Adı: ${forgotUsername}\nE-posta: ${forgotEmail}`, 
      'forgot_password'
    );
    setForgotLoading(false);
    if (success) {
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotPass(false);
        setForgotSuccess(false);
        setForgotUsername('');
        setForgotEmail('');
      }, 3000);
    } else {
      setError('Talep gönderilirken bir hata oluştu.');
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
                    Güvenli Evcil Hayvan Takip Sistemi
                </p>
            </div>

            {/* Status Message Banner */}
            {qrStatusMessage && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-medium text-sm leading-relaxed">
                        {qrStatusMessage}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="QR Kod veya E-posta"
                    type="text"
                    placeholder="Örn: MTRX01 veya ornek@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    readOnly={!!initialUsername} 
                    className={`font-mono text-center tracking-wider font-bold ${initialUsername ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}`}
                />
                <Input
                    label="Güvenlik PIN'i"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-center tracking-[0.5em] font-bold text-lg"
                    maxLength={6}
                    rightElement={<KeyRound size={20} className="text-slate-400" />}
                />

                {error && !showForgotPass && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-matrix-600 to-matrix-700 hover:from-matrix-500 hover:to-matrix-600 text-white font-bold rounded-xl shadow-lg shadow-matrix-500/30 dark:shadow-matrix-900/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Sisteme Giriş Yap'}
                </button>
            </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => setShowForgotPass(true)}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Şifremi Unuttum
          </button>

          <button 
            onClick={onRegisterClick}
            className="text-sm font-medium text-matrix-600 dark:text-matrix-400 hover:text-matrix-700 dark:hover:text-matrix-300 underline underline-offset-4 transition-colors"
          >
            Kayıt olmak için tıklayınız
          </button>
          
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

      {/* Forgot Password Modal */}
      {showForgotPass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <KeyRound className="text-matrix-500" /> Şifremi Unuttum
              </h3>
              <button 
                onClick={() => setShowForgotPass(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {forgotSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Talebiniz Alındı</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Şifre sıfırlama talebiniz yöneticiye iletildi. En kısa sürede sizinle iletişime geçilecektir.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Lütfen kullanıcı adınızı veya sisteme kayıtlı e-posta adresinizi girin. Yöneticimiz sizinle iletişime geçerek şifrenizi sıfırlayacaktır.
                  </p>
                  
                  <Input
                    label="Kullanıcı Adı"
                    type="text"
                    placeholder="Kullanıcı adınız"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                  />
                  
                  <div className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest my-2">VEYA</div>
                  
                  <Input
                    label="E-posta Adresi"
                    type="email"
                    placeholder="ornek@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  {error && showForgotPass && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-sm text-center font-bold">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    {forgotLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Talebi Gönder</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
