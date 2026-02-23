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
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onLoginClick} className="text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 sm:px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95">
            Giriş Yap
          </button>
          <button onClick={onRegisterClick} className="text-xs sm:text-sm font-bold bg-matrix-600 hover:bg-matrix-700 text-white px-3 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-matrix-500/30 transition-all active:scale-95">
            Ücretsiz Kayıt Ol
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-6 pt-8 pb-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-matrix-100 dark:bg-matrix-900/50 text-matrix-700 dark:text-matrix-300 text-sm font-bold">
              <Heart size={16} className="text-red-500" />
              <span>Tamamen Ücretsiz & Güvenli</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Can Dostunuz <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-matrix-500 to-blue-600">
                Asla Kaybolmasın
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Dijital QR künye sistemi ile evcil hayvanınızın güvende olduğundan emin olun. Onu bulan kişi saniyeler içinde size ulaşsın, konumu anında cebinize gelsin.
            </p>
            
            {/* Tasma Image Area */}
            <div className="w-full max-w-sm mx-auto lg:mx-0 mt-6 mb-8">
                <img 
                    src="/tasma.png" 
                    alt="Akıllı QR Künyeli Tasma" 
                    className="w-full h-auto object-contain drop-shadow-xl"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <button onClick={onRegisterClick} className="w-full sm:w-auto px-8 py-4 bg-matrix-600 hover:bg-matrix-700 text-white font-bold rounded-2xl shadow-xl shadow-matrix-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                Hemen Ücretsiz Katıl <ArrowRight size={20} />
              </button>
              <button onClick={onLoginClick} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                Sisteme Giriş Yap
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-sm lg:max-w-none mt-8 lg:mt-0">
            {/* Abstract Graphic / Mockup representation */}
            <div className="relative aspect-square rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-tr from-matrix-100 to-blue-50 dark:from-matrix-900/40 dark:to-blue-900/20 border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-8 lg:p-12">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pets/800/800?blur=2')] opacity-20 mix-blend-overlay" />
               <div className="relative z-10 bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-center mb-4 lg:mb-6">
                    <div className="w-20 h-20 lg:w-24 lg:h-24">
                        <img src="/logo.png" alt="MatrixC Logo" className="w-full h-full object-contain" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if(parent) parent.innerHTML = '<div class="w-full h-full bg-matrix-100 rounded-2xl flex items-center justify-center text-matrix-600 font-bold">Logo</div>'
                        }} />
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-center mb-1 lg:mb-2">MatrixC</h3>
                  <p className="text-center text-slate-500 dark:text-slate-400 text-xs lg:text-sm font-medium mb-4 lg:mb-6">Katkılarıyla hazırlanmıştır</p>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="h-8 lg:h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full flex items-center justify-center text-[10px] lg:text-xs text-slate-400 font-medium">Güvenli Altyapı</div>
                    <div className="h-8 lg:h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-5/6 mx-auto flex items-center justify-center text-[10px] lg:text-xs text-slate-400 font-medium">Hızlı Konum Tespiti</div>
                  </div>
               </div>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-1.5 lg:p-2 rounded-full text-red-600 dark:text-red-400">
                        <MapPin size={16} className="lg:w-5 lg:h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400">Anında</p>
                        <p className="text-xs lg:text-sm font-black">Konum Bildirimi</p>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 lg:p-2 rounded-full text-green-600 dark:text-green-400">
                        <ShieldCheck size={16} className="lg:w-5 lg:h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400">%100</p>
                        <p className="text-xs lg:text-sm font-black">Güvenli Altyapı</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Store Section */}
      <section className="py-4 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-r from-matrix-50 to-blue-50 dark:from-matrix-900/20 dark:to-blue-900/20 rounded-3xl p-8 lg:p-10 border border-matrix-100 dark:border-matrix-800/30 shadow-lg">
                <div className="text-center mb-8">
                    <h3 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white mb-3">Sistemi Nasıl Kullanabilirsiniz?</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">FindMe.mom tamamen ücretsiz bir altyapıdır. Sisteme dahil olmak için iki seçeneğiniz var:</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full">
                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-matrix-100 dark:bg-matrix-900/50 text-matrix-600">
                            <QrCode size={24} />
                        </div>
                        <h4 className="font-bold text-xl mb-3 text-slate-800 dark:text-white">1. Kendi Künyenizi Oluşturun</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">Tamamen ücretsiz kayıt olup kendi QR kodunuzu oluşturabilir, çıktısını alarak mevcut tasmanıza ekleyebilirsiniz.</p>
                        <button onClick={onRegisterClick} className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto">
                            Ücretsiz Kayıt Ol <ArrowRight size={18} />
                        </button>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full">
                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600">
                            <Heart size={24} />
                        </div>
                        <h4 className="font-bold text-xl mb-3 text-slate-800 dark:text-white">2. Hazır Tasarım Satın Alın</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">Dilerseniz sisteme entegre, suya dayanıklı ve şık tasarımlı hazır QR künyeli tasmalarımızdan sipariş verebilirsiniz.</p>
                        <a href="https://www.trendyol.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 w-full sm:w-auto">
                            Mağazayı Ziyaret Et <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-16 lg:py-24 relative z-10 border-t border-slate-200 dark:border-slate-800">
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
                        Sistemden ücretsiz oluşturduğunuz veya mağazamızdan edindiğiniz QR kodlu künyeyi profilinizle eşleştirin.
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
                <h4 className="text-white font-bold text-lg mb-4">FindMe.mom</h4>
                <p className="text-sm">Can dostlarınız için akıllı ve güvenli QR etiket sistemi.</p>
            </div>
            <div>
                <h4 className="text-white font-bold text-lg mb-4">İletişim</h4>
                <p className="text-sm mb-2">E-posta: <a href="mailto:findme@matrixc.com.tr" className="hover:text-white transition-colors">findme@matrixc.com.tr</a></p>
                <p className="text-sm">Instagram: <a href="https://instagram.com/matrixc" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@matrixc</a></p>
            </div>
            <div>
                <h4 className="text-white font-bold text-lg mb-4">Geliştirici</h4>
                <p className="text-sm mb-2">MatrixC Teknoloji</p>
                <a href="https://matrixc.com.tr" target="_blank" rel="noreferrer" className="text-sm hover:text-white transition-colors underline underline-offset-4">www.matrixc.com.tr</a>
            </div>
        </div>
      </footer>

      {/* Ambient Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[70%] bg-matrix-200/30 dark:bg-matrix-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
    </div>
  );
};
