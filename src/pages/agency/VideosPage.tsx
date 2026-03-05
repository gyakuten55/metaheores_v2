import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Play, Search, X, Loader2, LayoutGrid, List, ChevronRight, Plus, Edit3, Trash2, Check, Video as VideoIcon
} from 'lucide-react';

type Video = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  file_url: string | null;
  file_type: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  service_id: string | null;
  created_at: string;
};

type Category = { id: string; name: string };
type Service = { id: string; name: string };

const VideosPage: React.FC = () => {
  const { role } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Management States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: '',
    serviceId: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, serRes, vidRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('display_order'),
        supabase.from('services').select('id, name').order('name'),
        supabase.from('videos' as any).select('*').order('created_at', { ascending: false })
      ]);
      
      if (catRes.data) setCategories(catRes.data);
      if (serRes.data) setServices(serRes.data);
      if (vidRes.data) setVideos(vidRes.data as Video[]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVideoForm({ title: '', url: '', description: '', categoryId: '', serviceId: '' });
    setSelectedVideo(null);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title) return;
    if (!videoForm.url && !selectedFile && !selectedVideo?.file_url) {
      alert('YouTube URLまたは動画ファイルのどちらかは必須です。');
      return;
    }

    // Client-side size check (e.g., 100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      alert(`ファイルサイズが大きすぎます (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB)。100MB以下のファイルを選択してください。\n\n※100MB以上の動画を掲載したい場合は、YouTubeにアップロードしてそのURLを登録することをお勧めします。`);
      return;
    }

    setIsSubmitting(true);
    try {
      let filePath = selectedVideo?.file_url || null;
      let fileType = selectedVideo?.file_type || null;

      // Handle file upload
      if (selectedFile) {
        if (selectedVideo?.file_url) {
          await supabase.storage.from('documents').remove([selectedVideo.file_url]);
        }
        
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        filePath = `videos/${fileName}`;
        fileType = fileExt || null;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile);
          
        if (uploadError) {
          if (uploadError.message.includes('size')) {
            throw new Error('ファイルのサイズ制限を超えています。SupabaseのStorage設定で最大サイズを引き上げるか、より小さいファイルを選択してください。');
          }
          throw uploadError;
        }
      }

      const payload = {
        title: videoForm.title,
        url: videoForm.url || null,
        file_url: filePath,
        file_type: fileType,
        description: videoForm.description,
        category_id: videoForm.categoryId || null,
        service_id: videoForm.serviceId || null,
        updated_at: new Date().toISOString()
      };

      if (selectedVideo && isEditing) {
        await supabase.from('videos' as any).update(payload).eq('id', selectedVideo.id);
      } else {
        await supabase.from('videos' as any).insert(payload);
      }
      
      setIsAddModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error(error);
      alert(error.message || '保存中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    if (!window.confirm('動画を削除しますか？')) return;
    try {
      if (video.file_url) {
        await supabase.storage.from('documents').remove([video.file_url]);
      }
      await supabase.from('videos' as any).delete().eq('id', video.id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    setSelectedVideo(video);
    setVideoForm({
      title: video.title,
      url: video.url || '',
      description: video.description || '',
      categoryId: video.category_id || '',
      serviceId: video.service_id || ''
    });
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handlePlayVideo = async (video: Video) => {
    setSelectedVideo(video);
    setIsEditing(false);
    setPlaybackUrl(null);

    if (video.file_url) {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(video.file_url, 3600);
      if (data) setPlaybackUrl(data.signedUrl);
    }
  };

  const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (video: Video) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    const ytId = getYouTubeId(video.url);
    if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    return '/assets/top/business_bg.png';
  };

  const filteredVideos = videos.filter(video => {
    const titleMatch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = selectedCategory === 'all' || video.category_id === selectedCategory;
    const serMatch = selectedService === 'all' || video.service_id === selectedService;
    return titleMatch && catMatch && serMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800">動画ライブラリ</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Video Achievement Showcase</p>
        </div>
        <div className="flex items-center gap-3">
          {role === 'admin' && (
            <button 
              onClick={() => { resetForm(); setIsAddModalOpen(true); }} 
              className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center gap-1.5 mr-2"
            >
              <Plus size={12} /> 動画を追加
            </button>
          )}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input type="text" placeholder="タイトルで検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none">
          <option value="all">すべてのカテゴリ</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none">
          <option value="all">すべてのサービス</option>
          {services.map(ser => <option key={ser.id} value={ser.id}>{ser.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-200" size={40} /></div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-400 font-bold">動画が見つかりません。</p></div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} onClick={() => handlePlayVideo(video)} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                <img src={getThumbnail(video)} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 shadow-xl"><Play size={24} fill="currentColor" className="ml-1" /></div>
                </div>
                {role === 'admin' && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => startEdit(e, video)} className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-white shadow-lg"><Edit3 size={14} /></button>
                    <button onClick={(e) => handleDelete(e, video)} className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-white shadow-lg"><Trash2 size={14} /></button>
                  </div>
                )}
                {video.file_url && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[8px] text-white font-black uppercase flex items-center gap-1 backdrop-blur-sm">
                    <VideoIcon size={10} /> Local File
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.category_id && <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">{categories.find(c => c.id === video.category_id)?.name}</span>}
                  {video.service_id && <span className="text-[9px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">{services.find(s => s.id === video.service_id)?.name}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredVideos.map((video) => (
              <div key={video.id} onClick={() => handlePlayVideo(video)} className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer group transition-colors">
                <div className="w-24 aspect-video rounded overflow-hidden bg-slate-900 shrink-0">
                  <img src={getThumbnail(video)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(video.created_at).toLocaleDateString()}</span>
                    {video.service_id && <span className="text-[10px] text-blue-500 font-bold uppercase">{services.find(s => s.id === video.service_id)?.name}</span>}
                    {video.file_url && <VideoIcon size={12} className="text-slate-300" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {role === 'admin' && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all mr-2">
                      <button onClick={(e) => startEdit(e, video)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit3 size={16} /></button>
                      <button onClick={(e) => handleDelete(e, video)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  )}
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Play Modal */}
      {selectedVideo && !isEditing && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black relative">
              {selectedVideo.file_url && playbackUrl ? (
                <video src={playbackUrl} className="w-full h-full" controls autoPlay />
              ) : getYouTubeId(selectedVideo.url) ? (
                <iframe src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1`} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={selectedVideo.title} />
              ) : (
                <div className="flex items-center justify-center h-full text-white"><p>動画を再生できません</p></div>
              )}
              <button onClick={() => setSelectedVideo(null)} className="absolute -top-12 right-0 text-white hover:text-slate-300"><X size={32} /></button>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {selectedVideo.service_id && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded border border-blue-100">{services.find(s => s.id === selectedVideo.service_id)?.name}</span>}
                  <span className="text-xs text-slate-400 font-mono">{new Date(selectedVideo.created_at).toLocaleDateString()}</span>
                </div>
                {role === 'admin' && (
                  <button onClick={(e) => startEdit(e, selectedVideo)} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Edit3 size={12}/> 編集する</button>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">{selectedVideo.title}</h2>
              {selectedVideo.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedVideo.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">{isEditing ? '動画を編集' : '新規動画登録'}</h2>
              <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">タイトル</label>
                <input type="text" required value={videoForm.title} onChange={(e)=>setVideoForm({...videoForm, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">動画ソース (URLまたはファイルを指定)</p>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-1">YouTube URL</label>
                  <input type="url" value={videoForm.url} onChange={(e)=>setVideoForm({...videoForm, url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100 bg-white" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-1">または 動画ファイルをアップロード</label>
                  <input type="file" accept="video/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="text-xs text-slate-500 w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {isEditing && selectedVideo?.file_url && !selectedFile && (
                    <p className="text-[9px] text-blue-500 mt-1 flex items-center gap-1"><Check size={10} /> ファイルがアップロード済みです</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">サービス</label>
                  <select value={videoForm.serviceId} onChange={(e)=>setVideoForm({...videoForm, serviceId: e.target.value})} className="w-full px-2 py-2 border border-slate-200 rounded text-xs outline-none bg-white">
                    <option value="">なし</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">カテゴリ</label>
                  <select value={videoForm.categoryId} onChange={(e)=>setVideoForm({...videoForm, categoryId: e.target.value})} className="w-full px-2 py-2 border border-slate-200 rounded text-xs outline-none bg-white">
                    <option value="">なし</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">説明</label>
                <textarea value={videoForm.description} onChange={(e)=>setVideoForm({...videoForm, description: e.target.value})} className="w-full h-24 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100 resize-none" />
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

export default VideosPage;
