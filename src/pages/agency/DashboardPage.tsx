import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { FileText, Users, Clock, Download, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Database } from '../../types/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];

const DashboardPage: React.FC = () => {
  const { profile, role } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, docRes] = await Promise.all([
        supabase.from('categories').select('*').is('parent_id', null).order('display_order'),
        supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(5)
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (docRes.data) setRecentDocs(docRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.file_url) return;
    try {
      const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.file_url, 60);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-end justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">ダッシュボード</h1>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
            {profile?.full_name} / {role === 'admin' ? 'Administrator' : role === 'agent' ? 'Sales' : 'Guest'}
          </p>
        </div>
        {role === 'admin' && (
          <Link to="/agency/admin" className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center gap-1.5">
            <Users size={12} /> Admin Settings
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-5">
          {/* Categories Grid */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 text-slate-700">
              <Folder size={14} className="text-slate-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest">資料カテゴリ</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/agency/documents?category=${cat.id}`} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Updates Table */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock size={14} className="text-slate-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest">新着資料</h2>
              </div>
              <Link to="/agency/documents" className="text-[10px] font-bold text-blue-600 hover:underline uppercase">View All</Link>
            </div>
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100 text-[10px] font-black uppercase">
                  <tr>
                    <th className="px-4 py-2 w-12 text-center">Type</th>
                    <th className="px-4 py-2">Document</th>
                    <th className="px-4 py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentDocs.length > 0 ? (
                    recentDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3 text-center">
                           <span className="text-[9px] font-black px-1 py-0.5 rounded border border-slate-200 text-slate-400 uppercase">{doc.file_type || 'DOC'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 group-hover:text-blue-600 truncate max-w-[200px] sm:max-w-md">{doc.title}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400 text-[11px] font-mono tabular-nums">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-400 font-bold text-[11px]">表示できる資料はありません。</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-md shadow-sm p-5 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Account Info</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">User Name</label>
                <div className="text-sm font-bold text-slate-800">{profile?.full_name || '-'}</div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Company</label>
                <div className="text-sm font-bold text-slate-800">{profile?.company_name || '-'}</div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Assigned Role</label>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;