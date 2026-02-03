import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { PdfThumbnail } from '../components/PdfThumbnail';
import { ChevronRight, CheckCircle2, ChevronLeft, Download, Check } from 'lucide-react';

type FormStep = 'select' | 'input' | 'confirm' | 'complete';

interface DocumentItem {
  id: string;
  category: 'ai' | 'egg' | 'metaverse';
  title: string;
  description: string;
  pdfUrl: string; // Preview URL
  fileName: string; // Used for email link
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'ai-training',
    category: 'ai',
    title: 'AI人材育成研修 ホワイトペーパー',
    description: '実務に直結するAIリスキリング研修のカリキュラムと導入メリットをまとめた最新資料です。',
    pdfUrl: '/assets/documents/ホワイトペーパー_AI人材育成研修プログラム (1).pdf',
    fileName: 'ホワイトペーパー_AI人材育成研修プログラム (1).pdf'
  }
];

interface FormData {
  company: string;
  department: string;
  name: string;
  email: string;
  selectedDocIds: string[];
  sources: string[];
  sourceDetails: string;
  content: string;
  confirm_email_field: string;
}

const INITIAL_DATA: FormData = {
  company: '',
  department: '',
  name: '',
  email: '',
  selectedDocIds: [],
  sources: [],
  sourceDetails: '',
  content: '',
  confirm_email_field: '',
};

const SOURCE_OPTIONS = [
  { id: 'hp', label: 'ホームページ' },
  { id: 'event', label: 'イベント・セミナー' },
  { id: 'media', label: 'webサイトの記事やニュースメディア' },
  { id: 'search', label: '検索' },
  { id: 'introduction', label: '知人からの紹介' },
  { id: 'sns', label: 'ソーシャルネットワーク' },
  { id: 'other', label: 'その他' },
];

export const DocumentRequestPage: React.FC = () => {
  const [step, setStep] = useState<FormStep>('select');
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDocument = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDocIds: prev.selectedDocIds.includes(id)
        ? prev.selectedDocIds.filter(itemId => itemId !== id)
        : [...prev.selectedDocIds, id]
    }));
  };

  const handleCheckboxChange = (field: 'sources', id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(item => item !== id)
        : [...prev[field], id]
    }));
  };

  const goToInput = () => {
    if (formData.selectedDocIds.length === 0) {
      alert('資料を1つ以上選択してください。');
      return;
    }
    setStep('input');
    window.scrollTo(0, 0);
  };

  const goToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setStep('confirm');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: '資料請求',
          content: `【請求資料】\n${formData.selectedDocIds.map(id => DOCUMENTS.find(d => d.id === id)?.title).join('\n')}\n\n【お問い合わせ内容】\n${formData.content}`,
          type: 'document_request',
          documentFiles: formData.selectedDocIds.map(id => DOCUMENTS.find(d => d.id === id)?.fileName)
        }),
      });

      if (!response.ok) throw new Error('送信に失敗しました');

      setStep('complete');
      window.scrollTo(0, 0);
    } catch (error) {
      alert('送信中にエラーが発生しました。お手数ですがしばらく時間をおいてから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl py-8 md:py-12">
        <div className="flex items-center justify-center">
          {[ 
            { id: 'select', step: '01', label: '選択' },
            { id: 'input', step: '02', label: '入力' },
            { id: 'confirm', step: '03', label: '確認' },
            { id: 'complete', step: '04', label: '完了' }
          ].map((item, idx) => {
            const steps = ['select', 'input', 'confirm', 'complete'];
            const currentIdx = steps.indexOf(step);
            const itemIdx = steps.indexOf(item.id as FormStep);
            
            const isActive = step === item.id;
            const isDone = itemIdx < currentIdx || step === 'complete';

            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <span className={`text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] ${isActive || isDone ? 'text-blue-600' : 'text-gray-300'}`}>
                    STEP {item.step}
                  </span>
                  <span className={`text-[10px] md:text-sm font-black tracking-[0.1em] md:tracking-[0.2em] ${isActive || isDone ? 'text-gray-900' : 'text-gray-300'}`}>
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`w-8 md:w-20 h-px mx-3 md:mx-6 mt-4 md:mt-5 transition-colors duration-500 ${isDone ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <PageHero titleEn="DOCUMENT" titleJa="資料請求" />
      {renderStepIndicator()}

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SELECT */}
            {step === 'select' && (
              <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-12 text-center">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">請求する資料を選択してください</h3>
                  <p className="text-sm text-gray-500 font-bold">PDFの1ページ目がプレビュー表示されます。クリックで選択できます。</p>
                </div>

                {/* Categories */}
                {['ai', 'egg', 'metaverse'].map(cat => (
                  <div key={cat} className="mb-16 last:mb-0">
                    <div className="flex items-center gap-4 mb-8">
                      <h4 className="text-lg font-black text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-widest">
                        {cat === 'ai' ? 'AI事業' : cat === 'egg' ? 'HERO EGG' : 'メタバース・XR'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {DOCUMENTS.filter(doc => doc.category === cat).map(doc => {
                        const isSelected = formData.selectedDocIds.includes(doc.id);
                        return (
                          <div 
                            key={doc.id}
                            onClick={() => toggleDocument(doc.id)}
                            className={`group cursor-pointer relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${isSelected ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                          >
                            {/* Selection Overlay */}
                            {isSelected && (
                              <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                <Check size={20} strokeWidth={4} />
                              </div>
                            )}

                            {/* PDF Thumbnail Preview */}
                            <PdfThumbnail 
                              url={doc.pdfUrl} 
                              title={doc.title}
                              className={isSelected ? 'scale-105' : 'group-hover:scale-105 transition-transform duration-700'}
                            />

                            {/* Info */}
                            <div className="p-5 bg-white relative z-10">
                              <h5 className="text-sm font-black text-gray-900 mb-2 leading-tight min-h-[2.5rem] line-clamp-2">{doc.title}</h5>
                              <p className="text-[10px] font-bold text-gray-400 line-clamp-2 leading-relaxed">{doc.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">選択中:</span>
                    <span className="text-lg font-black text-blue-600">{formData.selectedDocIds.length} 件</span>
                  </div>
                  <button 
                    onClick={() => alert('現在資料を準備中です。恐れ入りますが、しばらくお待ちください。')}
                    className="inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] rounded-full shadow-xl bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    現在準備中です
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: INPUT */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-12 text-center">
                  <button onClick={() => setStep('select')} className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={14} /> 資料選択に戻る
                  </button>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">お客様情報をご入力ください</h3>
                  <p className="text-sm text-gray-500 font-bold">送信完了後、資料ダウンロードURLをメールにてお送りいたします。</p>
                </div>
                
                <form className="space-y-0 border-t-2 border-gray-900" onSubmit={goToConfirm}>
                  {/* Honeypot */}
                  <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <input type="text" name="confirm_email_field" value={formData.confirm_email_field} onChange={handleInputChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  {/* 会社名 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">貴社名 / 組織名</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="株式会社MetaHeroes" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* 部署・役職 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
                      <span className="font-bold text-gray-900 text-sm">部署名 / 役職名</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="広報部 マネージャー" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" /></div>
                  </div>

                  {/* お名前 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">お名前</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Meta 太郎" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* メールアドレス */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">メールアドレス</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@meta-heroes.co.jp" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required />
                      <p className="mt-2 text-[10px] text-gray-400 font-bold">※資料の送付先アドレスをご入力ください。</p>
                    </div>
                  </div>

                  {/* 知ったきっかけ */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm mt-1">任意</span>
                      <span className="font-bold text-gray-900 text-sm">知ったきっかけ</span>
                    </label>
                    <div className="px-8 py-8 bg-white space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SOURCE_OPTIONS.map(opt => (
                          <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={formData.sources.includes(opt.id)}
                              onChange={() => handleCheckboxChange('sources', opt.id)}
                            />
                            <div className={`w-5 h-5 border-2 transition-all rounded-sm flex items-center justify-center ${formData.sources.includes(opt.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                              <svg className={`w-3.5 h-3.5 text-blue-600 transition-transform ${formData.sources.includes(opt.id) ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 備考 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm mt-1">任意</span>
                      <span className="font-bold text-gray-900 text-sm">ご質問・ご要望</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><textarea name="content" value={formData.content} onChange={handleInputChange} rows={6} placeholder="導入時期の検討状況や、特に知りたい内容がございましたらご記入ください。" className="w-full border border-gray-300 py-3.5 px-4 outline-none font-bold resize-none" /></div>
                  </div>

                  {/* Privacy & Submit */}
                  <div className="py-20 text-center space-y-10">
                    <p className="text-xs text-gray-500 font-bold">こちらの<Link to="/contact/privacy" className="text-blue-600 hover:underline mx-1">「個人情報の取扱いについて」</Link>に同意の上、次へ進んでください。</p>
                    <label className="flex items-center justify-center gap-3 cursor-pointer group">
                      <div className="relative w-5 h-5">
                        <input type="checkbox" className="sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <div className={`w-full h-full border-2 transition-all rounded-sm flex items-center justify-center ${agreed ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                          <svg className={`w-3.5 h-3.5 text-blue-600 transition-transform ${agreed ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">同意して確認画面へ進む</span>
                    </label>
                    <div className="pt-6">
                      <button type="submit" disabled={!agreed} className={`inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] border-2 rounded-full ${agreed ? 'bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-gray-900 shadow-xl' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}>
                        入力内容を確認する
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12 text-center">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">請求内容をご確認ください</h3>
                  <p className="text-sm text-gray-500 font-bold">よろしければ「資料を請求する」ボタンを押してください。</p>
                </div>
                <div className="border-t-2 border-gray-900 bg-gray-50/30">
                  <ConfirmRow label="ご希望の資料" value={formData.selectedDocIds.map(id => DOCUMENTS.find(d => d.id === id)?.title).join(', ')} />
                  <ConfirmRow label="貴社名 / 組織名" value={formData.company} />
                  {formData.department && <ConfirmRow label="部署名 / 役職名" value={formData.department} />}
                  <ConfirmRow label="お名前" value={formData.name} />
                  <ConfirmRow label="メールアドレス" value={formData.email} />
                  <ConfirmRow label="知ったきっかけ" value={formData.sources.map(id => SOURCE_OPTIONS.find(o => o.id === id)?.label).join(', ')} />
                  {formData.content && <ConfirmRow label="ご質問・ご要望" value={formData.content} />}
                </div>
                <div className="py-20 flex flex-col items-center gap-6">
                  <button 
                    onClick={() => alert('現在資料を準備中です。恐れ入りますが、しばらくお待ちください。')}
                    className="inline-flex items-center justify-center px-20 py-5 bg-gray-100 text-gray-400 text-sm font-black tracking-[0.3em] transition-all min-w-[340px] rounded-full cursor-not-allowed"
                  >
                    現在準備中です
                  </button>
                  <button onClick={() => setStep('input')} className="inline-flex items-center justify-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="mr-1 w-4 h-4" /> 入力画面に戻る
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: COMPLETE */}
            {step === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-wider">資料請求ありがとうございます</h2>
                <div className="space-y-4 text-gray-600 font-bold leading-relaxed max-w-xl mx-auto">
                  <p>ご入力いただいたメールアドレス宛に、資料の案内をお送りいたしました。</p>
                  <p className="text-sm text-gray-400">※メールが届かない場合は、大変お手数ですが迷惑メールフォルダをご確認いただくか、再度お問い合わせください。</p>
                </div>
                <div className="pt-12 flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/" className="inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-black tracking-widest hover:bg-gray-900 hover:text-white transition-all rounded-full">
                    トップページへ
                  </Link>
                  <Link to="/services" className="inline-flex items-center justify-center px-12 py-4 bg-gray-900 text-white text-sm font-black tracking-widest hover:bg-black transition-all rounded-full">
                    サービス一覧を見る
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

const ConfirmRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
    <div className="bg-gray-50 px-8 py-6 font-bold text-gray-500 text-sm tracking-wider flex items-center">{label}</div>
    <div className="px-8 py-6 bg-white font-black text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
      {value || '---'}
    </div>
  </div>
);