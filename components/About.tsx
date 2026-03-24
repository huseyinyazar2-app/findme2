
import React, { useState } from 'react';
import { QrCode, Siren, ShieldCheck, HeartHandshake, Share2, Info, MessageSquare, Send, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { Input } from './ui/Input';
import { sendMessageToAdmin } from '../services/dbService';

interface AboutProps {
  user?: UserProfile | null;
}

export const About: React.FC<AboutProps> = ({ user }) => {
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSendContact = async () => {
      if (!contactSubject || !contactMessage) {
          setContactStatus({ type: 'error', text: 'Lütfen konu ve mesaj alanlarını doldurun.' });
          return;
      }
      setContactLoading(true);
      const success = await sendMessageToAdmin(
          null,
          user?.username || 'Ziyaretçi',
          user?.email || null,
          contactSubject,
          contactMessage,
          'contact'
      );
      setContactLoading(false);
      if (success) {
          setContactStatus({ type: 'success', text: 'Mesajınız başarıyla gönderildi.' });
          setContactSubject('');
          setContactMessage('');
      } else {
          setContactStatus({ type: 'error', text: 'Mesaj gönderilirken bir hata oluştu.' });
      }
      setTimeout(() => setContactStatus(null), 3000);
  };

  return (
    <div className="pb-32 pt-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-700 text-matrix-600 dark:text-matrix-400">
          <Info size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Hakkında
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wide">v2.1.0 • MatrixC Project</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-matrix-600 to-matrix-800 rounded-3xl p-8 text-white shadow-xl shadow-matrix-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-3 tracking-tight">MatrixC Find Me</h3>
            <p className="text-matrix-50 text-sm leading-relaxed font-medium opacity-90">
              Bu uygulama, can dostlarımızın güvenliği için geliştirilmiş, gönüllülük esasına dayalı ücretsiz bir sosyal sorumluluk projesidir. Amacımız, kayıp dostlarımızı sahiplerine en hızlı şekilde ulaştırmaktır.
            </p>
          </div>
          <HeartHandshake className="absolute -bottom-6 -right-6 text-white opacity-10 rotate-12" size={160} />
        </div>

        {/* How it Works Section */}
        <div>
           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider px-1">
             <Share2 size={16} className="text-matrix-600" /> Nasıl Çalışır?
           </h3>
           
           <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl shrink-0 text-slate-600 dark:text-slate-300">
                      <QrCode size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">1. Eşleştirme ve Kayıt</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                          Sizin için özel üretilen QR kod okutulur. Dostumuzun fotoğrafı, kimlik bilgileri ve iletişim tercihleri sisteme güvenle kaydedilir.
                      </p>
                  </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl shrink-0 text-red-600 dark:text-red-400">
                      <Siren size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">2. Acil Durum Modu</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                          Olası bir kayıp durumunda "Kayıp" modunu açarsınız. QR kod tarandığında anında kırmızı alarm ekranı ve iletişim butonları belirir.
                      </p>
                  </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl shrink-0 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">3. Güvenli Kavuşma</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                          Dostumuzu bulan kişi QR kodu okutur. Sadece sizin izin verdiğiniz "Herkese Açık" bilgileri görerek size doğrudan ulaşır.
                      </p>
                  </div>
              </div>
           </div>
        </div>

        {/* Contact Admin Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10 space-y-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                <MessageSquare size={16} className="text-matrix-500" /> İletişim / Yardım
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sistem yöneticisine mesaj gönderin. Sorunlarınızı veya önerilerinizi bize iletebilirsiniz.
            </p>
            
            <div className="space-y-3">
                 <Input 
                    type="text"
                    placeholder="Konu"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="!mb-0"
                />
                <textarea 
                    placeholder="Mesajınız..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-matrix-500/50 resize-none h-24"
                />
                
                <button 
                    onClick={handleSendContact}
                    disabled={contactLoading}
                    className="w-full bg-matrix-600 hover:bg-matrix-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {contactLoading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Mesajı Gönder</>}
                </button>

                {contactStatus && (
                    <div className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold animate-in fade-in ${contactStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {contactStatus.text}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-8 pb-4">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                MatrixC Software Solutions &copy; 2024
            </p>
        </div>

      </div>
    </div>
  );
};
