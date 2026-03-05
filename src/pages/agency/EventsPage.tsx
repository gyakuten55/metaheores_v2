import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Calendar as CalendarIcon, ExternalLink, Loader2, LayoutList, ChevronLeft, ChevronRight, X, Plus, Edit3, Trash2, Check 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Event = {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  event_dates: string[] | null;
  event_time_start: string | null;
  event_time_end: string | null;
  created_at: string;
  updated_at: string;
};

const EventsPage: React.FC = () => {
  const { role } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: Date; events: Event[] } | null>(null);

  // Management States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    content: '',
    url: '',
    dates: [] as string[],
    timeStart: '',
    timeEnd: ''
  });
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setEvents(data as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventForm({ title: '', content: '', url: '', dates: [], timeStart: '', timeEnd: '' });
    setTempDate('');
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: eventForm.title,
        content: eventForm.content,
        url: eventForm.url,
        event_dates: eventForm.dates.length > 0 ? eventForm.dates : null,
        event_time_start: eventForm.timeStart || null,
        event_time_end: eventForm.timeEnd || null,
        updated_at: new Date().toISOString()
      };

      if (selectedEvent && isEditing) {
        await supabase.from('events' as any).update(payload).eq('id', selectedEvent.id);
      } else {
        await supabase.from('events' as any).insert(payload);
      }
      
      setIsAddModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('イベントを削除しますか？')) return;
    try {
      await supabase.from('events' as any).delete().eq('id', id);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      content: event.content || '',
      url: event.url || '',
      dates: event.event_dates || [],
      timeStart: event.event_time_start || '',
      timeEnd: event.event_time_end || ''
    });
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  // --- Calendar Logic ---
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      if (e.event_dates && e.event_dates.length > 0) {
        return e.event_dates.some(dStr => {
          const d = new Date(dStr);
          return d.getDate() === date.getDate() && 
                 d.getMonth() === date.getMonth() && 
                 d.getFullYear() === date.getFullYear();
        });
      }
      const eDate = new Date(e.created_at);
      return eDate.getDate() === date.getDate() && 
             eDate.getMonth() === date.getMonth() && 
             eDate.getFullYear() === date.getFullYear();
    });
  };

  const formatDates = (event: Event) => {
    const dates = event.event_dates;
    const timeRange = event.event_time_start ? ` (${event.event_time_start.slice(0, 5)}〜${event.event_time_end?.slice(0, 5) || ''})` : '';
    
    if (!dates || dates.length === 0) return '日時未定' + timeRange;
    const sortedDates = [...dates].sort();
    if (sortedDates.length <= 3) {
      return sortedDates.map(d => new Date(d).toLocaleDateString()).join(', ') + timeRange;
    }
    return `${sortedDates[0] ? new Date(sortedDates[0]).toLocaleDateString() : ''} ...他${sortedDates.length - 1}日` + timeRange;
  };

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedDateEvents({ date, events: dayEvents });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-blue-500" size={24} />
            イベント情報
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Events & Announcements</p>
        </div>
        
        <div className="flex items-center gap-3">
          {role === 'admin' && (
            <button 
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-700 transition-all flex items-center gap-1.5 mr-2"
            >
              <Plus size={12} /> イベントを追加
            </button>
          )}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><LayoutList size={14} /> リスト</button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><CalendarIcon size={14} /> カレンダー</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-bold text-sm">現在掲載されているイベントはありません。</p>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="divide-y divide-slate-100">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h2>
                        <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1">
                          {formatDates(event)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {role === 'admin' && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all mr-2">
                          <button onClick={(e) => startEdit(e, event)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit3 size={16} /></button>
                          <button onClick={(e) => handleDelete(e, event.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      )}
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"><ChevronLeft size={20} /></button>
                  <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"><ChevronRight size={20} /></button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                  <div key={day} className="text-xs font-bold text-slate-400 py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((date, i) => {
                  if (!date) return <div key={i} className="aspect-square" />;
                  const dayEvents = getEventsForDate(date);
                  const isToday = new Date().toDateString() === date.toDateString();
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleDateClick(date)}
                      className={`min-h-[80px] border rounded-lg p-1 relative flex flex-col items-center justify-start cursor-pointer transition-all hover:shadow-md hover:border-blue-200 ${isToday ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100'}`}
                    >
                      <span className={`text-[10px] font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{date.getDate()}</span>
                      <div className="flex flex-col gap-1 w-full px-0.5 overflow-y-auto max-h-[60px] scrollbar-none">
                        {dayEvents.map(event => (
                          <div key={event.id} className="w-full text-[8px] bg-blue-100 text-blue-700 rounded px-1 py-0.5 truncate text-left">{event.title}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Daily Events List Modal */}
      <AnimatePresence>
        {selectedDateEvents && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDateEvents(null)}>
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md max-h-[80vh] flex flex-col border border-slate-200" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
                <h3 className="font-bold text-slate-700">{selectedDateEvents.date.toLocaleDateString()} のイベント</h3>
                <button onClick={() => setSelectedDateEvents(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="overflow-y-auto p-4 space-y-3">
                {selectedDateEvents.events.map(event => (
                  <button key={event.id} onClick={() => { setSelectedEvent(event); setSelectedDateEvents(null); }} className="w-full p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                    {event.event_time_start && (
                      <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-wider">{event.event_time_start.slice(0, 5)} 〜 {event.event_time_end?.slice(0, 5)}</p>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Modal */}
      <AnimatePresence>
        {selectedEvent && !isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-slate-700 text-lg">イベント詳細</h3>
                <div className="flex items-center gap-3">
                  {role === 'admin' && <button onClick={(e) => startEdit(e, selectedEvent)} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Edit3 size={14}/> 編集する</button>}
                  <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <div className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 font-mono">{formatDates(selectedEvent)}</div>
                  <h2 className="text-xl font-bold text-slate-800 leading-snug">{selectedEvent.title}</h2>
                </div>
                {selectedEvent.content && <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded border border-slate-100">{selectedEvent.content}</div>}
                {selectedEvent.url && <div className="pt-2"><a href={selectedEvent.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"><ExternalLink size={16} />関連リンクを開く</a></div>}
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"><button onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors shadow-sm">閉じる</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">{isEditing ? 'イベントを編集' : '新規イベント登録'}</h2>
              <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">イベント名</label>
                <input type="text" required value={eventForm.title} onChange={(e)=>setEventForm({...eventForm, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">開始時間</label>
                  <input type="time" value={eventForm.timeStart} onChange={(e)=>setEventForm({...eventForm, timeStart: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">終了時間</label>
                  <input type="time" value={eventForm.timeEnd} onChange={(e)=>setEventForm({...eventForm, timeEnd: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">開催日設定</label>
                <div className="flex gap-2 mb-2">
                  <input type="date" value={tempDate} onChange={(e)=>setTempDate(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
                  <button type="button" onClick={() => { if (tempDate && !eventForm.dates.includes(tempDate)) { setEventForm({ ...eventForm, dates: [...eventForm.dates, tempDate].sort() }); setTempDate(''); } }} className="px-3 py-2 bg-slate-100 text-slate-600 rounded text-xs font-bold hover:bg-slate-200">追加</button>
                </div>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded border border-slate-100 min-h-[40px]">
                  {eventForm.dates.length === 0 && <span className="text-xs text-slate-400">日付が追加されていません</span>}
                  {eventForm.dates.map(date => (
                    <span key={date} className="flex items-center gap-1 bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {new Date(date).toLocaleDateString()}
                      <button type="button" onClick={() => setEventForm({ ...eventForm, dates: eventForm.dates.filter(d => d !== date) })} className="text-blue-400 hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">内容</label>
                <textarea value={eventForm.content} onChange={(e)=>setEventForm({...eventForm, content: e.target.value})} className="w-full h-32 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">リンクURL</label>
                <input type="url" value={eventForm.url} onChange={(e)=>setEventForm({...eventForm, url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-slate-100" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={()=>{ setIsAddModalOpen(false); resetForm(); }} className="flex-1 px-4 py-2 border border-slate-200 text-slate-500 rounded text-xs font-bold hover:bg-slate-50">キャンセル</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 flex justify-center gap-2">
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {isEditing ? '更新' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
