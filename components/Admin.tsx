import React, { useState, useEffect } from 'react';
import { getAdminMessages, updateMessageStatus, deleteAdminMessage, updateAdminPassword, replyToAdminMessage, getAllUsersWithPets, sendNotification } from '../services/dbService';
import { Shield, Mail, Trash2, CheckCircle, KeyRound, LogOut, MessageSquare, AlertCircle, Send, Users, Filter, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';

interface AdminProps {
  onLogout: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementFilter, setAnnouncementFilter] = useState('all'); // all, lost, dog, cat
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementStatus, setAnnouncementStatus] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [msgs, usrs] = await Promise.all([
        getAdminMessages(),
        getAllUsersWithPets()
    ]);
    setMessages(msgs);
    setUsers(usrs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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

  const handleReply = async (msgId: string, username: string) => {
      if (!replyText.trim()) return;
      setReplyLoading(true);
      const success = await replyToAdminMessage(msgId, username, replyText);
      setReplyLoading(false);
      
      if (success) {
          setMessages(messages.map(m => m.id === msgId ? { ...m, status: 'resolved', reply: replyText } : m));
          setReplyingTo(null);
          setReplyText('');
      } else {
          alert("Yanıt gönderilirken bir hata oluştu.");
      }
  };

  const handleSendAnnouncement = async () => {
      if (!announcementTitle || !announcementMessage) {
          setAnnouncementStatus({ type: 'error', text: 'Lütfen başlık ve mesaj girin.' });
          return;
      }

      setAnnouncementLoading(true);
      
      let targetUsers = users;
      if (announcementFilter === 'lost') {
          targetUsers = users.filter(u => u.isLost);
      } else if (announcementFilter === 'dog') {
          targetUsers = users.filter(u => u.petType === 'Köpek');
      } else if (announcementFilter === 'cat') {
          targetUsers = users.filter(u => u.petType === 'Kedi');
      } else if (announcementFilter === 'new') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          targetUsers = users.filter(u => u.createdAt && new Date(u.createdAt) > sevenDaysAgo);
      }

      // Deduplicate by username
      const uniqueUsers = Array.from(new Map(targetUsers.map(u => [u.username, u])).values());

      let successCount = 0;
      for (const user of uniqueUsers) {
          const success = await sendNotification(user.username, announcementTitle, announcementMessage, 'announcement');
          if (success) successCount++;
      }

      setAnnouncementLoading(false);
      setAnnouncementStatus({ type: 'success', text: `${successCount} kullanıcıya duyuru gönderildi.` });
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setTimeout(() => setAnnouncementStatus(null), 4000);
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

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm flex flex-col gap-2">
                <button 
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center justify-between p-3 rounded-xl font-bold transition-colors ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                    <div className="flex items-center gap-2">
                        <Mail size={18} /> Gelen Kutusu
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('announcements')}
                    className={`flex items-center gap-2 p-3 rounded-xl font-bold transition-colors ${activeTab === 'announcements' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                    <Users size={18} /> Duyuru Gönder
                </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            
            {activeTab === 'messages' && (
                <>
                    <div className="flex items-center justify-between mb-2 px-2">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white">Kullanıcı Mesajları</h2>
                      <button onClick={fetchData} className="text-sm text-blue-500 hover:underline font-medium">
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
                            {msg.type === 'forgot_password' && msg.userPassword && (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono"><strong>Mevcut Şifre:</strong> {msg.userPassword}</span>
                            )}
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          {/* Reply Section */}
                          {msg.reply && (
                              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                  <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1"><Shield size={12}/> Admin Yanıtı:</p>
                                  <p className="text-sm text-blue-900 dark:text-blue-100">{msg.reply}</p>
                              </div>
                          )}

                          {msg.username && !msg.reply && msg.type !== 'forgot_password' && (
                              <div className="mt-4">
                                  {replyingTo === msg.id ? (
                                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                          <textarea 
                                              value={replyText}
                                              onChange={(e) => setReplyText(e.target.value)}
                                              placeholder="Kullanıcıya yanıtınız..."
                                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-20"
                                          />
                                          <div className="flex gap-2">
                                              <button 
                                                  onClick={() => handleReply(msg.id, msg.username)}
                                                  disabled={replyLoading || !replyText.trim()}
                                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                              >
                                                  {replyLoading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Gönder</>}
                                              </button>
                                              <button 
                                                  onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                  className="px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 rounded-xl text-sm font-bold transition-colors"
                                              >
                                                  İptal
                                              </button>
                                          </div>
                                      </div>
                                  ) : (
                                      <button 
                                          onClick={() => { setReplyingTo(msg.id); setReplyText(''); }}
                                          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                      >
                                          <MessageSquare size={14} /> Yanıtla
                                      </button>
                                  )}
                              </div>
                          )}
                        </div>
                      ))
                    )}
                </>
            )}

            {activeTab === 'announcements' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Duyuru Gönder</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Kullanıcılara toplu bildirim gönderin</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <Filter size={16} /> Hedef Kitle
                            </label>
                            <select 
                                value={announcementFilter}
                                onChange={(e) => setAnnouncementFilter(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            >
                                <option value="all">Tüm Kullanıcılar</option>
                                <option value="lost">Kayıp İlanı Aktif Olanlar</option>
                                <option value="dog">Köpek Sahipleri</option>
                                <option value="cat">Kedi Sahipleri</option>
                                <option value="new">Yeni Üyeler (Son 7 Gün)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duyuru Başlığı</label>
                            <Input 
                                type="text"
                                placeholder="Örn: Yeni Özellik Eklendi!"
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                                className="!mb-0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mesaj İçeriği</label>
                            <textarea 
                                value={announcementMessage}
                                onChange={(e) => setAnnouncementMessage(e.target.value)}
                                placeholder="Kullanıcılara iletilecek mesaj..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-32"
                            />
                        </div>

                        <button 
                            onClick={handleSendAnnouncement}
                            disabled={announcementLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {announcementLoading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Duyuruyu Gönder</>}
                        </button>

                        {announcementStatus && (
                            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold animate-in fade-in ${announcementStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {announcementStatus.text}
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
