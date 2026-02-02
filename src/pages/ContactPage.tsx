import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { ChevronRight, CheckCircle2, ChevronLeft, Send } from 'lucide-react';

type ContactCategory = 'business' | 'service' | 'partner' | 'recruit' | 'press' | 'other' | '';
type FormStep = 'input' | 'confirm' | 'complete';

interface FormData {
  category: ContactCategory;
  company: string;
  department: string;
  url: string;
  name: string;
  email: string;
  occupation: string;
  desiredJob: string;
  mediaName: string;
  publishDate: string;
  content: string;
}

const INITIAL_DATA: FormData = {
  category: '',
  company: '',
  department: '',
  url: '',
  name: '',
  email: '',
  occupation: '',
  desiredJob: '',
  mediaName: '',
  publishDate: '',
  content: '',
};

export const ContactPage: React.FC = () => {
  const [step, setStep] = useState<FormStep>('input');
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setStep('confirm');
    window.scrollTo(0, 0);
  };

  const goBackToInput = () => {
    setStep('input');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました。');
      }

      setStep('complete');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Submission error:', error);
      alert('申し訳ありません。送信中にエラーが発生しました。時間をおいて再度お試しいただくか、直接メールにてお問い合わせください。');
    } finally {
      setIsSubmitting(false);
    }
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
      <PageHero titleEn="CONTACT" titleJa="お問い合わせ" />
      {renderStepIndicator()}

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: INPUT */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-12 text-center">
                  <p className="text-sm text-gray-500 font-bold">以下のフォームより必要事項をご入力の上、送信してください。</p>
                </div>
                <form className="space-y-0 border-t-2 border-gray-900" onSubmit={goToConfirm}>
                  {/* お問い合わせ項目 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">お問い合わせ項目</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat" required>
                        <option value="">選択してください</option>
                        <option value="business">事業に関するお問い合わせ</option>
                        <option value="service">サービスに関するお問い合わせ</option>
                        <option value="partner">パートナーシップ・協業について</option>
                        <option value="recruit">採用に関するお問い合わせ</option>
                        <option value="press">取材・プレスに関するお問い合わせ</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                  </div>

                  {formData.category && (
                    <>
                      {/* カテゴリ別フィールド */}
                      {(formData.category === 'business' || formData.category === 'service' || formData.category === 'partner') && (
                        <>
                          <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                            <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                              <span className="font-bold text-gray-900 text-sm">貴社名 / 組織名</span>
                            </label>
                            <div className="px-8 py-8 bg-white"><input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="株式会社MetaHeroes" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                          </div>
                          <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                            <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                              <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
                              <span className="font-bold text-gray-900 text-sm">部署名 / 役職名</span>
                            </label>
                            <div className="px-8 py-8 bg-white"><input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="広報部 マネージャー" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" /></div>
                          </div>
                        </>
                      )}

                      {formData.category === 'recruit' && (
                        <>
                          <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                            <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                              <span className="font-bold text-gray-900 text-sm">現在の職業 / 所属</span>
                            </label>
                            <div className="px-8 py-8 bg-white"><input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="例）IT企業 勤務 / 大学4年" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                          </div>
                        </>
                      )}

                      {/* 共通基本項目 */}
                      <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                        <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                          <span className="font-bold text-gray-900 text-sm">お名前</span>
                        </label>
                        <div className="px-8 py-8 bg-white"><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Meta 太郎" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                      </div>
                      <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                        <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                          <span className="font-bold text-gray-900 text-sm">メールアドレス</span>
                        </label>
                        <div className="px-8 py-8 bg-white"><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@meta-heroes.co.jp" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                      </div>
                      <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                        <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm mt-1">必須</span>
                          <span className="font-bold text-gray-900 text-sm">お問い合わせ内容</span>
                        </label>
                        <div className="px-8 py-8 bg-white"><textarea name="content" value={formData.content} onChange={handleInputChange} rows={10} placeholder="詳細にご記入ください。" className="w-full border border-gray-300 py-3.5 px-4 outline-none font-bold resize-none" required /></div>
                      </div>

                      <div className="py-20 text-center space-y-10">
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  ご入力いただいた個人情報は、お問い合わせへの回答および情報提供のためにのみ利用し、<br className="hidden md:block" />
                  その他の目的で利用することはございません。こちらの
                  <Link to="/contact/privacy" className="text-blue-600 hover:underline mx-1">「個人情報の取扱いについて」</Link>
                  に同意の上、送信してください。
                </p>
                        <label className="flex items-center justify-center gap-3 cursor-pointer group">
                          <div className="relative w-5 h-5">
                            <input type="checkbox" className="sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                            <div className={`w-full h-full border-2 transition-all rounded-sm flex items-center justify-center ${agreed ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                              <svg className={`w-3.5 h-3.5 text-blue-600 transition-transform ${agreed ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                          </div>
                          <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">個人情報の取り扱いに同意する</span>
                        </label>
                        <div className="pt-6">
                          <button type="submit" disabled={!agreed} className={`inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] border-2 ${agreed ? 'bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-gray-900' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}>内容を確認する<ChevronRight className="ml-2 w-5 h-5" /></button>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </motion.div>
            )}

            {/* STEP 2: CONFIRM */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12 text-center">
                  <p className="text-sm text-gray-500 font-bold">入力内容をご確認ください。よろしければ「送信する」ボタンを押してください。</p>
                </div>
                <div className="border-t-2 border-gray-900 bg-gray-50/30">
                  {/* 確認用フィールド一覧 */}
                  <ConfirmRow label="お問い合わせ項目" value={formData.category} />
                  {formData.company && <ConfirmRow label="貴社名 / 組織名" value={formData.company} />}
                  {formData.department && <ConfirmRow label="部署名 / 役職名" value={formData.department} />}
                  {formData.occupation && <ConfirmRow label="現在の職業 / 所属" value={formData.occupation} />}
                  <ConfirmRow label="お名前" value={formData.name} />
                  <ConfirmRow label="メールアドレス" value={formData.email} />
                  <ConfirmRow label="お問い合わせ内容" value={formData.content} />
                </div>
                <div className="py-20 flex flex-col items-center gap-6">
                  <button onClick={handleFinalSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center px-20 py-5 bg-blue-600 text-white text-sm font-black tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all min-w-[340px]">
                    {isSubmitting ? '送信中...' : 'この内容で送信する'}
                    {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                  </button>
                  <button onClick={goBackToInput} disabled={isSubmitting} className="inline-flex items-center justify-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
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
                <h2 className="text-3xl font-black text-gray-900 tracking-wider">お問い合わせ完了</h2>
                <div className="space-y-4 text-gray-600 font-bold leading-relaxed">
                  <p>お問い合わせありがとうございました。<br />送信内容の控えをメールでお送りしましたのでご確認ください。</p>
                  <p className="text-sm text-gray-400">※メールが届かない場合は、迷惑メールフォルダをご確認いただくか、<br />再度お問い合わせをお願いいたします。</p>
                </div>
                <div className="pt-12">
                  <Link to="/" className="inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-black tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                    トップページへ戻る
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

// ヘルパーコンポーネント: 確認画面の行
const ConfirmRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
    <div className="bg-gray-50 px-8 py-6 font-bold text-gray-500 text-sm tracking-wider flex items-center">{label}</div>
    <div className="px-8 py-6 bg-white font-black text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
      {value || '---'}
    </div>
  </div>
);
