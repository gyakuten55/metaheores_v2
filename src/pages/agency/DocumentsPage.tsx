import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { 
  FileText, Plus, Search, Filter, Download, Trash2, X, Check, Loader2, FolderOpen, Tag, AlignLeft, Edit3, Save, Eye, Maximize2 
} from 'lucide-react';

type Document = Database['public']['Tables']['documents']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

const DocumentsPage: React.FC = () => {
  const { profile, role } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [docForm, setDocForm] = useState({ title: '', description: '', content: '', categoryId: '', serviceId: '', allowedRoles: ['admin', 'agent'] as UserRole[] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, serRes, docRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('services').select('*').order('name'),
        supabase.from('documents').select('*').order('created_at', { ascending: false })
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (serRes.data) setServices(serRes.data);
      if (docRes.data) setDocuments(docRes.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDocClick = async (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditing(false);
    setPreviewUrl(null);
    if (doc.file_url) {
      const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_url, 3600);
      if (data) setPreviewUrl(data.signedUrl);
    }
  };

  const startEdit = (doc: Document) => {
    setDocForm({ title: doc.title, description: doc.description || '', content: doc.content || '', categoryId: doc.category_id || '', serviceId: doc.service_id || '', allowedRoles: doc.allowed_roles || ['admin', 'agent'] });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.categoryId) return;
    setIsSubmitting(true);
    try {
      let filePath = selectedDoc?.file_url || null;
      let fileType = selectedDoc?.file_type || null;
      if (selectedFile) {
        if (selectedDoc?.file_url) await supabase.storage.from('documents').remove([selectedDoc.file_url]);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        filePath = `uploads/${fileName}`;
        fileType = fileExt;
        await supabase.storage.from('documents').upload(filePath, selectedFile);
      }
      const payload = { title: docForm.title, description: docForm.description, content: docForm.content, category_id: docForm.categoryId, service_id: docForm.serviceId || null, file_url: filePath, file_type: fileType, allowed_roles: docForm.allowedRoles, updated_at: new Date().toISOString() };
      if (selectedDoc) { await supabase.from('documents').update(payload).eq('id', selectedDoc.id); }
      else { await supabase.from('documents').insert({ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id }); }
      setIsAddModalOpen(false); setIsEditing(false); setSelectedDoc(null); resetForm(); fetchData();
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  const resetForm = () => { setDocForm({ title: '', description: '', content: '', categoryId: '', serviceId: '', allowedRoles: ['admin', 'agent'] }); setSelectedFile(null); };

  const handleDownload = async (doc: Document) => {
    if (!doc.file_url) return;
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_url, 60);
    if (data) window.open(data.signedUrl, '_blank');
  };

  const handleDelete = async (id: string, fileUrl: string | null) => {
    if (!window.confirm('削除しますか？')) return;
    await supabase.from('documents').delete().eq('id', id);
    if (fileUrl) await supabase.storage.from('documents').remove([fileUrl]);
    setSelectedDoc(null); fetchData();
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category_id === selectedCategory;
    const matchesService = selectedService === 'all' || doc.service_id === selectedService;
    return matchesSearch && matchesCategory && matchesService;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">資料ライブラリ</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Document Repository</p>
        </div>
        {role === 'admin' && (
          <button onClick={() => { setSelectedDoc(null); resetForm(); setIsAddModalOpen(true); }} className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center gap-1.5">
            <Plus size={12} /> Add Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-slate-200" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none">
          <option value="all">すべてのカテゴリ</option>
          {categories.filter(c => !c.parent_id).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none">
          <option value="all">すべてのサービス</option>
          {services.map(ser => <option key={ser.id} value={ser.id}>{ser.name}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">Document Title</th>
                <th className="px-4 py-2">Category / Service</th>
                <th className="px-4 py-2 text-right">Ext</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" /></td></tr>
              ) : filteredDocs.length === 0 ? (
                <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold">資料が見つかりません。</td></tr>
              ) : filteredDocs.map((doc) => (
                <tr key={doc.id} onClick={() => handleDocClick(doc)} className="hover:bg-blue-50/30 cursor-pointer transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        {doc.file_url ? <Eye size={12} /> : <AlignLeft size={12} />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 group-hover:text-blue-600 truncate max-w-[180px] sm:max-w-xs">{doc.title}</div>
                        {doc.description && <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">{doc.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 font-black uppercase">{categories.find(c => c.id === doc.category_id)?.name}</span>
                      {doc.service_id && <span className="text-[9px] text-blue-600 font-black uppercase flex items-center gap-1"><Tag size={8} /> {services.find(s => s.id === doc.service_id)?.name}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-400 uppercase">{doc.file_type || 'TXT'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {(selectedDoc || isAddModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
          <div className={`bg-white rounded shadow-2xl overflow-hidden flex flex-col w-full max-h-[95vh] ${(!isEditing && !isAddModalOpen && selectedDoc?.file_url) ? 'max-w-5xl' : 'max-w-xl'}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <h2 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{isAddModalOpen ? 'New Document' : isEditing ? 'Edit Document' : 'Document Preview'}</h2>
              <button onClick={() => { setSelectedDoc(null); setIsAddModalOpen(false); setIsEditing(false); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="flex flex-col md:flex-row overflow-hidden">
              {(!isEditing && !isAddModalOpen && selectedDoc?.file_url) && (
                <div className="flex-[1.5] bg-slate-100 p-4 border-r border-slate-200 overflow-y-auto min-h-[30vh]">
                  {selectedDoc.file_type?.toLowerCase() === 'pdf' ? (
                    <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-[40vh] md:h-[70vh] rounded border border-slate-200 bg-white" title="Preview" />
                  ) : ['jpg','jpeg','png','webp'].includes(selectedDoc.file_type?.toLowerCase() || '') ? (
                    <img src={previewUrl!} className="max-w-full h-auto rounded shadow-sm border border-slate-200" alt="Preview" />
                  ) : <div className="text-[10px] font-bold text-slate-400 text-center p-10">プレビュー非対応</div>}
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {(isAddModalOpen || isEditing) ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                      <input type="text" required value={docForm.title} onChange={(e) => setDocForm({...docForm, title: e.target.value})} className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-slate-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                        <select required value={docForm.categoryId} onChange={(e) => setDocForm({...docForm, categoryId: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs outline-none">{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service</label>
                        <select value={docForm.serviceId} onChange={(e) => setDocForm({...docForm, serviceId: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"><option value="">None</option>{services.map(ser => <option key={ser.id} value={ser.id}>{ser.name}</option>)}</select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                      <input type="text" value={docForm.description} onChange={(e) => setDocForm({...docForm, description: e.target.value})} className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Content</label>
                      <textarea value={docForm.content} onChange={(e) => setDocForm({...docForm, content: e.target.value})} className="w-full h-32 px-3 py-1.5 border border-slate-200 rounded text-xs outline-none resize-none" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-200 text-center">
                      <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Attachment</label>
                      <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="text-[10px] text-slate-500 w-full" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="button" onClick={() => { setIsEditing(false); setIsAddModalOpen(false); resetForm(); }} className="flex-1 px-3 py-2 border border-slate-200 text-slate-500 rounded text-[10px] font-black uppercase hover:bg-slate-50">Cancel</button>
                      <button type="submit" disabled={isSubmitting} className="flex-1 px-3 py-2 bg-slate-800 text-white rounded text-[10px] font-black uppercase hover:bg-slate-700 disabled:opacity-50">{isSubmitting ? '...' : 'Save'}</button>
                    </div>
                  </form>
                ) : selectedDoc && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">{categories.find(c => c.id === selectedDoc.category_id) && <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">{categories.find(c => c.id === selectedDoc.category_id)?.name}</span>}</div>
                      {role === 'admin' && <button onClick={() => startEdit(selectedDoc)} className="text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={14} /></button>}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedDoc.title}</h3>
                    {selectedDoc.description && <p className="text-[11px] text-slate-500 leading-relaxed">{selectedDoc.description}</p>}
                    {selectedDoc.content && <div className="bg-slate-50 border border-slate-100 rounded p-4 text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedDoc.content}</div>}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[9px] font-bold text-slate-300 uppercase">Updated: {new Date(selectedDoc.updated_at).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        {selectedDoc.file_url && <button onClick={() => handleDownload(selectedDoc)} className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded shadow-sm hover:bg-blue-700 flex items-center gap-1.5"><Download size={12} /> Download</button>}
                        {role === 'admin' && <button onClick={() => handleDelete(selectedDoc.id, selectedDoc.file_url)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
