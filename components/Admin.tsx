import React, { useState, useEffect } from 'react';
import { getAdminMessages, updateMessageStatus, deleteAdminMessage, updateAdminPassword } from '../services/dbService';
import { Shield, Mail, Trash2, CheckCircle, KeyRound, LogOut, MessageSquare, AlertCircle } from 'lucide-react';
import { Input } from './ui/Input';

interface AdminProps {
  onLogout: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getAdminMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, status: 'read' | 'resolved') => {
    const success = await updateMessageStatus(id, status);
    if (success) {
      setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    const success = await deleteAdminMessage(id);
    if (success) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const handleChangePassword = async () => {
    if (newPass.length < 4) {
      setPassMessage({ type: 'error', text: "Şifre en az 4 karakter olmalıdır." });
      return;
    }
    const success = await updateAdminPassword('admin', newPass);
    if (success) {
      setPassMessage({ type: 'success', text: "Admin şifresi güncellendi." });
      setNewPass('');
      setTimeout(() => setPassMessage(null), 3000);
    } else {
      setPassMessage({ type: 'error', text: "Şifre güncellenemedi." });
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-matrix-950 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-matrix-100 dark:bg-matrix-900/50 p-4 rounded-2xl text-matrix-600 dark:text-matrix-400">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">Admin Paneli</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sistem yönetimi ve mesajlar</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <KeyRound size={18} className="text-purple-500" /> Şifre Değiştir
              </h3>
              <div className="space-y-3">
                <Input 
                  type="password"
                  placeholder="Yeni Admin Şifresi"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="!mb-0"
                />
                <button 
                  onClick={handleChangePassword}
                  className="w-full bg-slate-800 text-white dark:bg-slate-700 py-2 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Güncelle
                </button>
                {passMessage && (
                  <div className={`text-xs font-bold p-2 rounded-lg text-center ${passMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {passMessage.text}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" /> Gelen Kutusu
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                    {unreadCount} Yeni
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Messages */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Kullanıcı Mesajları</h2>
              <button onClick={fetchMessages} className="text-sm text-blue-500 hover:underline font-medium">
                Yenile
              </button>
            </div>

            {loading ? (
              <div className="text-center p-8 text-slate-500">Yükleniyor...</div>
            ) : messages.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm">
                <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Mesaj Yok</h3>
                <p className="text-sm text-slate-500">Gelen kutusu boş.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border-l-4 transition-all ${
                    msg.status === 'unread' ? 'border-red-500' : 
                    msg.status === 'resolved' ? 'border-emerald-500 opacity-70' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {msg.type === 'forgot_password' ? (
                        <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <AlertCircle size={12} /> Şifre Sıfırlama
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <MessageSquare size={12} /> İletişim
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(msg.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {msg.status === 'unread' && (
                        <button 
                          onClick={() => handleStatusChange(msg.id, 'read')}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Okundu İşaretle"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {msg.status !== 'resolved' && (
                        <button 
                          onClick={() => handleStatusChange(msg.id, 'resolved')}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Çözüldü İşaretle"
                        >
                          <Shield size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{msg.subject}</h4>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap gap-3">
                    {msg.username && <span><strong>Kullanıcı:</strong> {msg.username}</span>}
                    {msg.email && <span><strong>E-posta:</strong> {msg.email}</span>}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
