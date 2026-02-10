import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { 
  Trash2, 
  Tag, 
  Loader2, 
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Mail,
  X,
  Calendar,
  RefreshCw,
  KeyRound,
  Edit3
} from 'lucide-react';

type Service = Database['public']['Tables']['services']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type ProfileWithEmail = Database['public']['Tables']['profiles']['Row'] & { email: string };

export const AdminPage: React.FC = () => {
  const { role, user } = useAuth();
  
  // States
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<ProfileWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<ProfileWithEmail | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ email: '', password: '', company_name: '', role: 'agent' as any });
  const [editForm, setEditForm] = useState({ company_name: '', role: 'agent' as any });
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Form States
  const [newServiceName, setNewServiceName] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', display_order: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [serRes, catRes, usersRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.functions.invoke('manage-users', { body: { action: 'list' } })
      ]);
      
      if (serRes.data) setServices(serRes.data);
      if (catRes.data) setCategories(catRes.data);
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
    if (!newUserForm.email || !newUserForm.password || !newUserForm.company_name) return;
    setIsSubmitting(true);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('manage-users', {
        body: { 
          action: 'create', 
          ...newUserForm
        }
      });
      if (funcError || data?.error) throw new Error(data?.error || 'アカウント作成に失敗しました');
      
      setIsAddingUser(false);
      setNewUserForm({ email: '', password: '', company_name: '', role: 'agent' });
      fetchData();
      alert('アカウントを作成しました。');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    await supabase.from('categories').insert({ 
      name: newCategory.name.trim(), 
      display_order: 0,
      slug: slug
    });
    setNewCategory({ name: '', display_order: 0 });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('カテゴリを削除しますか？紐づく資料が表示されなくなる可能性があります。')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchData();
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !editForm.company_name) return;
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          company_name: editForm.company_name,
          role: editForm.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
      
      if (updateError) throw updateError;
      
      setIsEditingUser(false);
      fetchData();
      setSelectedUser({ ...selectedUser, company_name: editForm.company_name, role: editForm.role });
    } catch (err: any) {
      alert(err.message);
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
                onClick={() => setIsAddingUser(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-blue-700 transition-all flex items-center gap-1.5"
              >
                <Plus size={12} /> アカウント追加
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-medium text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">会社名</th>
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
                        setIsEditingUser(false);
                        setEditForm({ company_name: u.company_name || '', role: u.role });
                      }}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 group-hover:text-blue-600">{u.company_name || '未設定'}</div>
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

        {/* Sidebar: Services & Categories */}
        <div className="space-y-6">
          {/* Category Management */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-sm flex items-center gap-2">
              <LayoutDashboard size={16} className="text-slate-400" /> カテゴリ管理
            </div>
            <div className="p-5 space-y-4">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input type="text" placeholder="新カテゴリ名" value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory, name: e.target.value})} className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                <button type="submit" className="px-3 py-1.5 bg-slate-800 text-white rounded text-[10px] font-bold">追加</button>
              </form>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {categories.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 text-xs bg-slate-50 rounded border border-slate-100 group">
                    <span className="text-slate-700">{c.name}</span>
                    <button onClick={()=>handleDeleteCategory(c.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-800 text-sm">新規アカウント作成</h2>
              <button onClick={() => setIsAddingUser(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">メールアドレス</label>
                <input 
                  type="email" 
                  required 
                  value={newUserForm.email} 
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="example@meta-heroes.co.jp"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">パスワード</label>
                <input 
                  type="password" 
                  required 
                  value={newUserForm.password} 
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="6文字以上"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">会社名</label>
                <input 
                  type="text" 
                  required 
                  value={newUserForm.company_name} 
                  onChange={(e) => setNewUserForm({ ...newUserForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="株式会社XXX"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ロール</label>
                <select 
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="agent">AGENT (代理店)</option>
                  <option value="admin">ADMIN (管理者)</option>
                  <option value="guest">GUEST (ゲスト)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddingUser(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} 
                  作成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-800 text-sm">アカウント詳細</h2>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                {isEditingUser ? (
                  <div className="flex-1 space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">会社名</label>
                    <input 
                      type="text" 
                      value={editForm.company_name} 
                      onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-base font-bold outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-slate-900">{selectedUser.company_name || '会社名未設定'}</h3>
                )}
                {!isEditingUser && (
                  <button onClick={() => setIsEditingUser(true)} className="text-blue-600 hover:text-blue-800">
                    <Edit3 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Mail size={12} /> メールアドレス</label>
                  <div className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded border border-slate-100 font-mono">{selectedUser.email}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12} /> ロール</label>
                    {isEditingUser ? (
                      <select 
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs outline-none bg-white"
                      >
                        <option value="admin">ADMIN</option>
                        <option value="agent">AGENT</option>
                        <option value="guest">GUEST</option>
                      </select>
                    ) : (
                      <div className="text-sm font-bold text-blue-600">{selectedUser.role.toUpperCase()}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> 登録日</label>
                    <div className="text-sm text-slate-600">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {isEditingUser && (
                  <div className="pt-4 flex gap-2">
                    <button 
                      onClick={handleUpdateUser}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? '保存中...' : '変更を保存'}
                    </button>
                    <button 
                      onClick={() => setIsEditingUser(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50"
                    >
                      キャンセル
                    </button>
                  </div>
                )}

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
                {selectedUser.id !== user?.id && (
                  <button onClick={() => handleDeleteUser(selectedUser.id)} className="px-4 py-2.5 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100 flex items-center gap-2"><Trash2 size={14} /> 削除</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};