import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { ChevronRight, CheckCircle2, ChevronLeft, Download } from 'lucide-react';

type FormStep = 'input' | 'confirm' | 'complete';

interface FormData {
  company: string;
  department: string;
  name: string;
  email: string;
  documents: string[];
  content: string;
}

const INITIAL_DATA: FormData = {
  company: '',
  department: '',
  name: '',
  email: '',
  documents: [],
  content: '',
};

const AVAILABLE_DOCUMENTS = [
  { id: 'corporate', label: '会社案内・総合資料' },
  { id: 'aivo', label: 'HERO AIVO サービス資料' },
  { id: 'training', label: 'AI人材育成研修 サービス案内' },
  { id: 'holoshare', label: 'ホロシェア (Holoshare) サービス資料' },
  { id: 'xr', label: 'XRソリューション 実績・活用ガイド' },
];

export const DocumentRequestPage: React.FC = () => {
  const [step, setStep] = useState<FormStep>('input');
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.includes(id)
        ? prev.documents.filter(item => item !== id)
        : [...prev.documents, id]
    }));
  };

  const goToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || formData.documents.length === 0) {
      if (formData.documents.length === 0) alert('資料を1つ以上選択してください。');
      return;
    }
    setStep('confirm');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('complete');
    window.scrollTo(0, 0);
    setIsSubmitting(false);
  };

  const renderStepIndicator = () => (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl py-12">
        <div className="flex items-center justify-center">
          {[
            { id: 'input', step: '01', label: '入力' },
            { id: 'confirm', step: '02', label: '確認' },
            { id: 'complete', step: '03', label: '完了' }
          ].map((item, idx) => {
            const isActive = step === item.id;
            const isDone = (step === 'confirm' && item.id === 'input') || (step === 'complete');
            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center gap-3">
                  <span className={`text-[10px] font-black tracking-[0.3em] ${isActive || isDone ? 'text-blue-600' : 'text-gray-300'}`}>
                    STEP {item.step}
                  </span>
                  <span className={`text-sm font-black tracking-[0.2em] ${isActive || isDone ? 'text-gray-900' : 'text-gray-300'}`}>
                    {item.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 md:w-24 h-px mx-6 md:mx-10 mt-5 transition-colors duration-500 ${isDone ? 'bg-blue-600' : 'bg-gray-200'}`} />
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

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: INPUT */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-12 text-center">
                  <p className="text-sm text-gray-500 font-bold">必要事項をご入力ください。送信完了後、資料ダウンロードURLをメールにてお送りいたします。</p>
                </div>
                <form className="space-y-0 border-t-2 border-gray-900" onSubmit={goToConfirm}>
                  
                  {/* 希望資料選択 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">ご希望の資料</span>
                    </label>
                    <div className="px-8 py-8 bg-white space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_DOCUMENTS.map(doc => (
                          <label key={doc.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={formData.documents.includes(doc.id)}
                              onChange={() => handleCheckboxChange(doc.id)}
                            />
                            <div className={`w-5 h-5 border-2 transition-all rounded-sm flex items-center justify-center ${formData.documents.includes(doc.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                              <svg className={`w-3.5 h-3.5 text-blue-600 transition-transform ${formData.documents.includes(doc.id) ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{doc.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
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
                      <button type="submit" disabled={!agreed} className={`inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] border-2 ${agreed ? 'bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-gray-900 shadow-xl' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}>
                        入力内容を確認する
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: CONFIRM */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12 text-center">
                  <p className="text-sm text-gray-500 font-bold">請求内容をご確認ください。よろしければ「資料を請求する」ボタンを押してください。</p>
                </div>
                <div className="border-t-2 border-gray-900 bg-gray-50/30">
                  <ConfirmRow label="ご希望の資料" value={formData.documents.map(id => AVAILABLE_DOCUMENTS.find(d => d.id === id)?.label).join(', ')} />
                  <ConfirmRow label="貴社名 / 組織名" value={formData.company} />
                  {formData.department && <ConfirmRow label="部署名 / 役職名" value={formData.department} />}
                  <ConfirmRow label="お名前" value={formData.name} />
                  <ConfirmRow label="メールアドレス" value={formData.email} />
                  {formData.content && <ConfirmRow label="ご質問・ご要望" value={formData.content} />}
                </div>
                <div className="py-20 flex flex-col items-center gap-6">
                  <button onClick={handleFinalSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center px-20 py-5 bg-blue-600 text-white text-sm font-black tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all min-w-[340px]">
                    {isSubmitting ? '送信中...' : '資料を請求する'}
                    {!isSubmitting && <Download className="ml-2 w-4 h-4" />}
                  </button>
                  <button onClick={() => setStep('input')} disabled={isSubmitting} className="inline-flex items-center justify-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="mr-1 w-4 h-4" /> 入力画面に戻る
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: COMPLETE */}
            {step === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-wider">資料請求ありがとうございます</h2>
                <div className="space-y-4 text-gray-600 font-bold leading-relaxed max-w-xl mx-auto">
                  <p>ご入力いただいたメールアドレス宛に、資料のダウンロードURLをお送りいたしました。</p>
                  <p className="text-sm text-gray-400">※メールが届かない場合は、大変お手数ですが迷惑メールフォルダをご確認いただくか、再度お問い合わせください。</p>
                </div>
                <div className="pt-12 flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/" className="inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-black tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                    トップページへ
                  </Link>
                  <Link to="/services" className="inline-flex items-center justify-center px-12 py-4 bg-gray-900 text-white text-sm font-black tracking-widest hover:bg-black transition-all">
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
