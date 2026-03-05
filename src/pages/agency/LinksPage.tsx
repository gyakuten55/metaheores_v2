import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  ExternalLink, Loader2, Link as LinkIcon, Globe, Share2, Plus, Edit3, Trash2, X, Check 
} from 'lucide-react';

type LinkData = {
  id: string;
  title: string;
  url: string;
  category: string | null;
  description: string | null;
  created_at: string;
};

const LinksPage: React.FC = () => {
  const { role } = useAuth();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Management States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('links' as any)
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      if (data) setLinks(data as LinkData[]);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLinkForm({ title: '', url: '', category: '', description: '' });
    setSelectedLink(null);
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title || !linkForm.url) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: linkForm.title,
        url: linkForm.url,
        category: linkForm.category,
        description: linkForm.description,
        updated_at: new Date().toISOString()
      };

      if (selectedLink && isEditing) {
        await supabase.from('links' as any).update(payload).eq('id', selectedLink.id);
      } else {
        await supabase.from('links' as any).insert(payload);
      }
      
      setIsAddModalOpen(false);
      resetForm();
      fetchLinks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('リンクを削除しますか？')) return;
    try {
      await supabase.from('links' as any).delete().eq('id', id);
      fetchLinks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (e: React.MouseEvent, link: LinkData) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      category: link.category || '',
      description: link.description || ''
    });
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const getCategoryIcon = (category: string | null) => {
    const cat = category?.toLowerCase();
    if (cat?.includes('sns') || cat?.includes('twitter') || cat?.includes('x') || cat?.includes('instagram')) return <Share2 size={18} className="text-pink-500" />;
    if (cat?.includes('official') || cat?.includes('サイト')) return <Globe size={18} className="text-blue-500" />;
    return <LinkIcon size={18} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LinkIcon className="text-blue-500" size={24} />
            関連リンク
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">MetaHeroes Related Sites & SNS</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus size={12} /> リンクを追加
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-bold text-sm">現在登録されているリンクはありません。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-start gap-4 relative"
            >
              <div className="p-2.5 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors">
                {getCategoryIcon(link.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h2>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-400 shrink-0" />
                </div>
                {link.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {link.description}
                  </p>
                )}
                {link.category && (
                  <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {link.category}
                  </span>
                )}
              </div>
              {role === 'admin' && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => startEdit(e, link)} className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-white shadow-sm border border-slate-100"><Edit3 size={12} /></button>
                  <button onClick={(e) => handleDelete(e, link.id)} className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-white shadow-sm border border-slate-100"><Trash2 size={12} /></button>
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">{isEditing ? 'リンクを編集' : '新規リンク登録'}</h2>
              <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">タイトル</label>
                <input type="text" required value={linkForm.title} onChange={(e)=>setLinkForm({...linkForm, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">URL</label>
                <input type="url" required value={linkForm.url} onChange={(e)=>setLinkForm({...linkForm, url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">カテゴリ</label>
                <input type="text" value={linkForm.category} onChange={(e)=>setLinkForm({...linkForm, category: e.target.value})} placeholder="SNS, 公式, etc." className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">説明</label>
                <textarea value={linkForm.description} onChange={(e)=>setLinkForm({...linkForm, description: e.target.value})} className="w-full h-24 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100 resize-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={()=>{ setIsAddModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border border-slate-200 text-slate-500 rounded text-xs font-bold hover:bg-slate-50">キャンセル</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 flex justify-center gap-2">
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {isEditing ? '更新' : '登録'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksPage;