import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Send, Building, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2 
} from 'lucide-react';

const SERVICES = ['HERO AIVO', 'AI人材育成研修', 'AIリスキリング', 'Holoshare', 'Metaheroes guild', 'XRソリューション', '防災メタバース'];
const INTEREST_LEVELS = ['低', '中', '高', '至急'];

const ConnectPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ company_name: '', email: '', phone: '', contact_person: '', interested_services: [] as string[], interest_level: '中', comments: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.interested_services.length === 0) return alert('関心サービスを選択してください。');
    setLoading(true);
    try {
      await supabase.from('leads').insert({ ...formData, created_by: user?.id });
      await supabase.functions.invoke('send-connect-email', { body: { leadData: formData, agentProfile: profile } });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center space-y-4">
        <CheckCircle2 size={40} className="mx-auto text-green-500" />
        <h1 className="text-lg font-bold text-slate-800">送信完了</h1>
        <p className="text-xs text-slate-500">トスアップありがとうございます。担当者よりご連絡いたします。</p>
        <button onClick={() => setSubmitted(false)} className="px-5 py-2 bg-slate-800 text-white rounded text-xs font-bold uppercase">Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Send size={16} className="text-blue-600" /> MHコネクト</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Customer Introduction (Toss-up)</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden text-xs">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building size={12} /> Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">企業名 *</label>
                <input type="text" required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full px-2.5 py-1.5 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-slate-100" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">担当者名 *</label>
                <input type="text" required value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} className="w-full px-2.5 py-1.5 border border-slate-200 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">メールアドレス *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-2.5 py-1.5 border border-slate-200 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">電話番号</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-2.5 py-1.5 border border-slate-200 rounded outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interested Services *</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES.map(s => (
                <label key={s} className={`p-2 rounded border transition-all cursor-pointer text-center font-bold ${formData.interested_services.includes(s) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <input type="checkbox" checked={formData.interested_services.includes(s)} onChange={() => setFormData({...formData, interested_services: formData.interested_services.includes(s) ? formData.interested_services.filter(x => x !== s) : [...formData.interested_services, s]})} className="hidden" />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={12} /> Comments</h2>
            <div className="flex gap-2 mb-3">
              {INTEREST_LEVELS.map(l => (
                <button key={l} type="button" onClick={() => setFormData({...formData, interest_level: l})} className={`flex-1 py-1 px-2 rounded border text-[10px] font-black uppercase ${formData.interest_level === l ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{l}</button>
              ))}
            </div>
            <textarea value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} className="w-full h-24 px-2.5 py-1.5 border border-slate-200 rounded outline-none resize-none" placeholder="補足情報を入力..." />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <p className="text-[9px] text-slate-400 font-bold max-w-xs leading-tight">※ 送信後、担当チームへ自動通知されます。セールス担当者より改めてご連絡いたします。</p>
          <button type="submit" disabled={loading} className="shrink-0 px-6 py-2 bg-blue-600 text-white rounded text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConnectPage;