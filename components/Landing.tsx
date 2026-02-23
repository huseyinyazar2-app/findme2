import React from 'react';
import { ShieldCheck, MapPin, Heart, ArrowRight, QrCode } from 'lucide-react';

interface LandingProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-matrix-950 text-slate-900 dark:text-white overflow-x-hidden selection:bg-matrix-500 selection:text-white">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <span className="text-xl font-black tracking-tight">FindMe<span className="text-matrix-600">.mom</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLoginClick} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-matrix-600 dark:hover:text-matrix-400 transition-colors">
            Giriş Yap
          </button>
          <button onClick={onRegisterClick} className="text-sm font-bold bg-matrix-600 hover:bg-matrix-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-matrix-500/30 transition-all active:scale-95">
            Ücretsiz Kayıt Ol
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-6 pt-12 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-matrix-100 dark:bg-matrix-900/50 text-matrix-700 dark:text-matrix-300 text-sm font-bold">
              <Heart size={16} className="text-red-500" />
              <span>Tamamen Ücretsiz & Güvenli</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Can Dostunuz <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-matrix-500 to-blue-600">
                Asla Kaybolmasın
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Akıllı QR etiket sistemi ile evcil hayvanınızın güvende olduğundan emin olun. Onu bulan kişi saniyeler içinde size ulaşsın, konumu anında cebinize gelsin.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button onClick={onRegisterClick} className="w-full sm:w-auto px-8 py-4 bg-matrix-600 hover:bg-matrix-700 text-white font-bold rounded-2xl shadow-xl shadow-matrix-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                Hemen Ücretsiz Katıl <ArrowRight size={20} />
              </button>
              <button onClick={onLoginClick} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                Sisteme Giriş Yap
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            {/* Abstract Graphic / Mockup representation */}
            <div className="relative aspect-square rounded-[3rem] bg-gradient-to-tr from-matrix-100 to-blue-50 dark:from-matrix-900/40 dark:to-blue-900/20 border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-12">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pets/800/800?blur=2')] opacity-20 mix-blend-overlay" />
               <div className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-matrix-50 dark:bg-matrix-900/50 rounded-2xl">
                        <QrCode size={64} className="text-matrix-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-center mb-2">FindMe.mom</h3>
                  <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Akıllı Evcil Hayvan Etiketi</p>
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-5/6 mx-auto" />
                    <div className="h-12 bg-matrix-600 rounded-xl w-full mt-6" />
                  </div>
               </div>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Anında</p>
                        <p className="text-sm font-black">Konum Bildirimi</p>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">%100</p>
                        <p className="text-sm font-black">Güvenli Altyapı</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-24 relative z-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">Nasıl Çalışır?</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                    Hiçbir uygulama indirmeye gerek kalmadan, sadece telefonunuzun kamerasını kullanarak saniyeler içinde işlem yapın.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 mx-auto bg-matrix-100 dark:bg-matrix-900/50 text-matrix-600 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl font-black">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Ücretsiz Kayıt Olun</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        Sisteme tamamen ücretsiz kayıt olun ve evcil hayvanınızın profilini saniyeler içinde oluşturun.
                    </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 mx-auto bg-matrix-100 dark:bg-matrix-900/50 text-matrix-600 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl font-black">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">QR Kodunuzu Eşleştirin</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        Satın aldığınız veya edindiğiniz akıllı tasmadaki QR kodu profilinizle eşleştirin.
                    </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 mx-auto bg-matrix-100 dark:bg-matrix-900/50 text-matrix-600 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl font-black">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Güvende Hissedin</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        Dostunuz kaybolduğunda, bulan kişi QR kodu okutarak size anında konum ve iletişim bilgisi göndersin.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Ambient Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[70%] bg-matrix-200/30 dark:bg-matrix-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
    </div>
  );
};
