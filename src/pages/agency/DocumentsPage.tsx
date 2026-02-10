import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { 
  Plus, Search, Download, Trash2, X, Loader2, Tag, AlignLeft, Edit3, Eye 
} from 'lucide-react';

type Document = Database['public']['Tables']['documents']['Row'] & {
  document_files?: {
    id: string;
    file_url: string;
    file_type: string | null;
    file_name: string | null;
  }[];
};
type Category = Database['public']['Tables']['categories']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

const DocumentsPage: React.FC = () => {
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('service') || 'all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{ id: string; url: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [docForm, setDocForm] = useState({ title: '', description: '', content: '', categoryId: '', serviceId: '', allowedRoles: ['admin', 'agent'] as UserRole[] });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => { fetchData(); }, []);

  // Sync state with URL params when they change
  useEffect(() => {
    const catParam = searchParams.get('category');
    const serParam = searchParams.get('service');
    if (catParam) setSelectedCategory(catParam);
    if (serParam) setSelectedService(serParam);
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, serRes, docRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }).order('name', { ascending: true }),
        supabase.from('services').select('*').order('name', { ascending: true }),
        supabase.from('documents').select('*, document_files(*)').order('created_at', { ascending: false })
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (serRes.data) setServices(serRes.data);
      if (docRes.data) setDocuments(docRes.data as Document[]);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDocClick = async (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditing(false);
    setPreviewUrls([]);
    if (doc.document_files && doc.document_files.length > 0) {
      const urls = await Promise.all(
        doc.document_files.map(async (file) => {
          const { data } = await supabase.storage.from('documents').createSignedUrl(file.file_url, 3600);
          return data ? { id: file.id, url: data.signedUrl } : null;
        })
      );
      setPreviewUrls(urls.filter((u): u is { id: string; url: string } => u !== null));
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
      const payload: any = { 
        title: docForm.title, 
        description: docForm.description, 
        content: docForm.content, 
        category_id: docForm.categoryId, 
        service_id: docForm.serviceId || null, 
        allowed_roles: docForm.allowedRoles, 
        updated_at: new Date().toISOString() 
      };

      let docId = selectedDoc?.id;

      if (selectedDoc) { 
        await supabase.from('documents').update(payload).eq('id', selectedDoc.id); 
      } else { 
        const { data, error } = await supabase.from('documents').insert({ 
          ...payload, 
          created_by: (await supabase.auth.getUser()).data.user?.id 
        }).select(); 
        if (data && data[0]) docId = data[0].id;
        if (error) throw error;
      }

      if (docId && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `uploads/${fileName}`;
          
          await supabase.storage.from('documents').upload(filePath, file);
          
          await supabase.from('document_files').insert({
            document_id: docId,
            file_url: filePath,
            file_type: fileExt || null,
            file_name: file.name
          });
        }
      }

      setIsAddModalOpen(false); setIsEditing(false); setSelectedDoc(null); resetForm(); fetchData();
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  const resetForm = () => { 
    setDocForm({ title: '', description: '', content: '', categoryId: '', serviceId: '', allowedRoles: ['admin', 'agent'] }); 
    setSelectedFiles([]); 
  };

  const handleDownload = async (fileUrl: string) => {
    const { data } = await supabase.storage.from('documents').createSignedUrl(fileUrl, 60);
    if (data) window.open(data.signedUrl, '_blank');
  };

  const handleDeleteFile = async (fileId: string, fileUrl: string) => {
    if (!window.confirm('ファイルを削除しますか？')) return;
    await supabase.from('document_files').delete().eq('id', fileId);
    await supabase.storage.from('documents').remove([fileUrl]);
    fetchData();
    if (selectedDoc) {
      const updatedFiles = selectedDoc.document_files?.filter(f => f.id !== fileId) || [];
      setSelectedDoc({ ...selectedDoc, document_files: updatedFiles });
    }
  };

  const handleDelete = async (id: string, files?: Document['document_files']) => {
    if (!window.confirm('資料を削除しますか？')) return;
    await supabase.from('documents').delete().eq('id', id);
    if (files && files.length > 0) {
      await supabase.storage.from('documents').remove(files.map(f => f.file_url));
    }
    setSelectedDoc(null); fetchData();
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category_id === selectedCategory;
    const matchesService = selectedService === 'all' || doc.service_id === selectedService;
    // Check permissions
    const matchesRole = role === 'admin' || (doc.allowed_roles && doc.allowed_roles.includes(role as UserRole));
    
    return matchesSearch && matchesCategory && matchesService && matchesRole;
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
            <Plus size={12} /> 資料を追加
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input type="text" placeholder="タイトルで検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-slate-200" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none">
          <option value="all">すべてのカテゴリ</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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
                <th className="px-4 py-2">資料タイトル</th>
                <th className="px-4 py-2">カテゴリ / サービス</th>
                <th className="px-4 py-2 text-right">添付</th>
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
                        {doc.document_files && doc.document_files.length > 0 ? <Eye size={12} /> : <AlignLeft size={12} />}
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
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-400 uppercase">{doc.document_files?.length || 0} Files</span>
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
          <div className={`bg-white rounded shadow-2xl overflow-hidden flex flex-col w-full max-h-[95vh] ${(!isEditing && !isAddModalOpen && selectedDoc?.document_files && selectedDoc.document_files.length > 0) ? 'max-w-5xl' : 'max-w-xl'}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <h2 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{isAddModalOpen ? '新規資料登録' : isEditing ? '資料編集' : '資料プレビュー'}</h2>
              <button onClick={() => { setSelectedDoc(null); setIsAddModalOpen(false); setIsEditing(false); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="flex flex-col md:flex-row overflow-hidden">
              {(!isEditing && !isAddModalOpen && selectedDoc?.document_files && selectedDoc.document_files.length > 0) && (
                <div className="flex-[1.5] bg-slate-100 p-4 border-r border-slate-200 overflow-y-auto min-h-[30vh]">
                  <div className="grid grid-cols-1 gap-4">
                    {selectedDoc.document_files.map((file) => {
                      const pUrl = previewUrls.find(u => u.id === file.id)?.url;
                      return (
                        <div key={file.id} className="bg-white rounded border border-slate-200 p-2 space-y-2">
                          <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">{file.file_name || 'File'}</span>
                            <button onClick={() => handleDownload(file.file_url)} className="text-blue-600 hover:text-blue-700 p-1"><Download size={14} /></button>
                          </div>
                          {file.file_type?.toLowerCase() === 'pdf' ? (
                            pUrl ? (
                              <iframe src={`${pUrl}#toolbar=0`} className="w-full h-[40vh] md:h-[60vh] rounded border border-slate-100" title={file.file_name || 'Preview'} />
                            ) : <div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
                          ) : ['jpg','jpeg','png','webp'].includes(file.file_type?.toLowerCase() || '') ? (
                            pUrl ? (
                              <img src={pUrl} className="max-w-full h-auto rounded mx-auto" alt="Preview" />
                            ) : <div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-slate-200" /></div>
                          ) : <div className="text-[9px] font-bold text-slate-300 text-center py-4 italic">No Preview for {file.file_type}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {(isAddModalOpen || isEditing) ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">タイトル</label>
                      <input type="text" required value={docForm.title} onChange={(e) => setDocForm({...docForm, title: e.target.value})} className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-slate-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">カテゴリ</label>
                        <select required value={docForm.categoryId} onChange={(e) => setDocForm({...docForm, categoryId: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs outline-none">{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">サービス</label>
                        <select value={docForm.serviceId} onChange={(e) => setDocForm({...docForm, serviceId: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"><option value="">None</option>{services.map(ser => <option key={ser.id} value={ser.id}>{ser.name}</option>)}</select>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">公開範囲 (Allowed Roles)</label>
                      <div className="flex flex-wrap gap-3 p-2 border border-slate-200 rounded bg-slate-50/50">
                        {(['admin', 'agent', 'guest'] as const).map((roleOption) => (
                          <label key={roleOption} className={`flex items-center gap-2 cursor-pointer ${roleOption === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                              type="checkbox"
                              checked={docForm.allowedRoles.includes(roleOption)}
                              disabled={roleOption === 'admin'}
                              onChange={(e) => {
                                const currentRoles = docForm.allowedRoles;
                                if (e.target.checked) {
                                  setDocForm({ ...docForm, allowedRoles: [...currentRoles, roleOption] });
                                } else {
                                  setDocForm({ ...docForm, allowedRoles: currentRoles.filter(r => r !== roleOption) });
                                }
                              }}
                              className="rounded border-slate-300 text-slate-800 focus:ring-slate-800 scale-90"
                            />
                            <span className="text-xs font-bold text-slate-700 capitalize">{roleOption}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">説明</label>
                      <input type="text" value={docForm.description} onChange={(e) => setDocForm({...docForm, description: e.target.value})} className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">内容</label>
                      <textarea value={docForm.content} onChange={(e) => setDocForm({...docForm, content: e.target.value})} className="w-full h-32 px-3 py-1.5 border border-slate-200 rounded text-xs outline-none resize-none" />
                    </div>

                    {isEditing && selectedDoc?.document_files && selectedDoc.document_files.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">現在のファイル</label>
                        <div className="space-y-1">
                          {selectedDoc.document_files.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded">
                              <span className="text-[10px] text-slate-600 truncate max-w-[150px]">{file.file_name}</span>
                              <button type="button" onClick={() => handleDeleteFile(file.id, file.file_url)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-200 text-center">
                      <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">新規ファイル追加 (複数可)</label>
                      <input type="file" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} className="text-[10px] text-slate-500 w-full" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="button" onClick={() => { setIsEditing(false); setIsAddModalOpen(false); resetForm(); }} className="flex-1 px-3 py-2 border border-slate-200 text-slate-500 rounded text-[10px] font-black uppercase hover:bg-slate-50">キャンセル</button>
                      <button type="submit" disabled={isSubmitting} className="flex-1 px-3 py-2 bg-slate-800 text-white rounded text-[10px] font-black uppercase hover:bg-slate-700 disabled:opacity-50">{isSubmitting ? '...' : '保存'}</button>
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
                    
                    {selectedDoc.document_files && selectedDoc.document_files.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">添付ファイル ({selectedDoc.document_files.length})</label>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedDoc.document_files.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="text-[8px] font-black px-1 py-0.5 bg-slate-100 rounded uppercase">{file.file_type}</span>
                                <span className="text-[10px] text-slate-600 truncate">{file.file_name}</span>
                              </div>
                              <button onClick={() => handleDownload(file.file_url)} className="text-blue-600 p-1"><Download size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[9px] font-bold text-slate-300 uppercase">Updated: {new Date(selectedDoc.updated_at).toLocaleDateString()}</div>
                      {role === 'admin' && <button onClick={() => handleDelete(selectedDoc.id, selectedDoc.document_files)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
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
