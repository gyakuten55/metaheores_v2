import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { 
  Plus, 
  Trash2, 
  Tag, 
  Loader2, 
  AlertCircle,
  Settings,
  ShieldCheck,
  Users,
  Building,
  Mail,
  X,
  Check,
  Calendar,
  RefreshCw,
  KeyRound
} from 'lucide-react';

type Service = Database['public']['Tables']['services']['Row'];
type ProfileWithEmail = Database['public']['Tables']['profiles']['Row'] & { email: string };

export const AdminPage: React.FC = () => {
  const { role } = useAuth();
  
  // States
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<ProfileWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileWithEmail | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Form States
  const [newServiceName, setNewServiceName] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [serRes, usersRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.functions.invoke('manage-users', { body: { action: 'list' } })
      ]);
      
      if (serRes.data) setServices(serRes.data);
      if (usersRes.data && !usersRes.error) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('manage-users', {
        body: { action: 'create', ...newUser }
      });
      if (funcError || data?.error) throw new Error(data?.error || '作成に失敗しました');
      
      setIsAddModalOpen(false);
      setNewUser({ email: '', password: '', full_name: '', company_name: '' });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    setIsSubmitting(true);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('manage-users', {
        body: { 
          action: 'reset-password', 
          userId: selectedUser.id, 
          password: newPassword 
        }
      });
      if (funcError || data?.error) throw new Error(data?.error || '再設定に失敗しました');
      
      alert('パスワードを更新しました。');
      setIsResettingPassword(false);
      setNewPassword('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      await supabase.functions.invoke('manage-users', { body: { action: 'delete', userId } });
      setSelectedUser(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    await supabase.from('services').insert({ name: newServiceName.trim() });
    setNewServiceName('');
    fetchData();
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('削除しますか？')) return;
    await supabase.from('services').delete().eq('id', id);
    fetchData();
  };

  if (role !== 'admin') return <div className="p-12 text-center">アクセス権限がありません</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Settings size={20} className="text-slate-400" />
            管理者設定
          </h1>
          <p className="text-sm text-slate-500 mt-1">アカウントとマスターデータの管理</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                <Users size={16} className="text-slate-400" />
                登録アカウント一覧
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 flex items-center gap-1"
              >
                <Plus size={14} /> 新規作成
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-medium text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">名前 / 会社</th>
                    <th className="px-6 py-3">ロール</th>
                    <th className="px-6 py-3 text-right">最終更新</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={3} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" /></td></tr>
                  ) : users.map(u => (
                    <tr 
                      key={u.id} 
                      onClick={() => {
                        setSelectedUser(u);
                        setIsResettingPassword(false);
                      }}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 group-hover:text-blue-600">{u.full_name || '未設定'}</div>
                        <div className="text-xs text-slate-400">{u.company_name || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          u.role === 'agent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs text-right">
                        {new Date(u.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Services */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-sm flex items-center gap-2">
              <Tag size={16} className="text-slate-400" /> サービス管理
            </div>
            <div className="p-5 space-y-4">
              <form onSubmit={handleAddService} className="flex gap-2">
                <input type="text" placeholder="新サービス名" value={newServiceName} onChange={(e)=>setNewServiceName(e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                <button type="submit" className="px-3 py-1.5 bg-slate-800 text-white rounded text-[10px] font-bold">追加</button>
              </form>
              <div className="space-y-1">
                {services.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 text-xs bg-slate-50 rounded border border-slate-100 group">
                    <span className="text-slate-700">{s.name}</span>
                    <button onClick={()=>handleDeleteService(s.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-800 text-sm">アカウント詳細</h2>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">{selectedUser.full_name || '未設定'}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><Building size={14} /> {selectedUser.company_name || '会社名未設定'}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Mail size={12} /> メールアドレス</label>
                  <div className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded border border-slate-100 font-mono">{selectedUser.email}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12} /> ロール</label>
                    <div className="text-sm font-bold text-blue-600">{selectedUser.role.toUpperCase()}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> 登録日</label>
                    <div className="text-sm text-slate-600">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Password Reset Section */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  {!isResettingPassword ? (
                    <button 
                      onClick={() => setIsResettingPassword(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw size={12} /> パスワードを再設定する
                    </button>
                  ) : (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest"><KeyRound size={12} className="inline mr-1"/> 新しいパスワード</label>
                      <div className="flex gap-2">
                        <input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="新しいパスワードを入力"
                          className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <button 
                          onClick={handleResetPassword}
                          disabled={isSubmitting || !newPassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                          保存
                        </button>
                        <button 
                          onClick={() => setIsResettingPassword(false)}
                          className="px-3 py-2 border border-slate-200 text-slate-400 rounded hover:bg-slate-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex gap-3 border-t border-slate-100">
                <button onClick={() => setSelectedUser(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50">閉じる</button>
                {selectedUser.role !== 'admin' && (
                  <button onClick={() => handleDeleteUser(selectedUser.id)} className="px-4 py-2.5 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100 flex items-center gap-2"><Trash2 size={14} /> 削除</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">セールスアカウントの新規作成</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-[11px] rounded flex gap-2 border border-red-100"><AlertCircle size={14} />{error}</div>}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">担当者名</label>
                <input type="text" required value={newUser.full_name} onChange={(e)=>setNewUser({...newUser, full_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">会社名</label>
                <input type="text" required value={newUser.company_name} onChange={(e)=>setNewUser({...newUser, company_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">メールアドレス</label>
                <input type="email" required value={newUser.email} onChange={(e)=>setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">初期パスワード</label>
                <input type="password" required value={newUser.password} onChange={(e)=>setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={()=>setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-500 rounded text-xs font-bold hover:bg-slate-50">キャンセル</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 flex justify-center gap-2">
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} 作成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};