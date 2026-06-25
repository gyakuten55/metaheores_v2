import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { ChevronRight, CheckCircle2, ChevronLeft, Send, UploadCloud, X } from 'lucide-react';

type FormStep = 'input' | 'confirm' | 'complete';

interface EntryData {
  desiredJob: string;       // 応募職種
  employmentType: string;   // 希望雇用形態
  name: string;             // お名前
  furigana: string;         // ふりがな
  email: string;            // メールアドレス
  phone: string;            // 電話番号
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  address: string;          // 住所
  skills: string;           // 保有スキル・経験
  motivation: string;       // 志望動機・自己PR
  portfolio: string;        // ポートフォリオURL / SNS（任意）
  referralSource: string;   // Meta Heroesを知ったきっかけ
  confirm_email_field?: string; // ハニーポット
}

const INITIAL_DATA: EntryData = {
  desiredJob: '',
  employmentType: '',
  name: '',
  furigana: '',
  email: '',
  phone: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  address: '',
  skills: '',
  motivation: '',
  portfolio: '',
  referralSource: '',
  confirm_email_field: '',
};

// 応募職種の選択肢
const JOB_OPTIONS = [
  'XR事業（営業）',
  'AI事業（営業）',
  '施設活用事業',
  'マーケティング（デジタルマーケター）',
  'コーポレート（総合事務）',
  'その他',
];

// 採用ページのカテゴリID → 応募職種ラベル
const JOB_ID_MAP: { [key: string]: string } = {
  xr: 'XR事業（営業）',
  ai: 'AI事業（営業）',
  facility: '施設活用事業',
  marketing: 'マーケティング（デジタルマーケター）',
  corporate: 'コーポレート（総合事務）',
};

const EMPLOYMENT_OPTIONS = ['正社員', '契約社員', '業務委託', 'アルバイト・パート', 'インターン'];

const REFERRAL_OPTIONS = [
  '当社Webサイト',
  '求人サイト（Indeed等）',
  'SNS（X / Instagram等）',
  '知人・社員からの紹介',
  'イベント・セミナー',
  '検索エンジン',
  'その他',
];

// 1ファイルあたりの上限（Vercelのリクエスト本文上限4.5MBを考慮して小さめに設定）
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const YEARS = Array.from({ length: 2010 - 1955 + 1 }, (_, i) => String(2010 - i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

// File → base64（data URLのプレフィックスを除いた純粋なbase64）
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const REQUIRED_BADGE = (
  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
);
const OPTIONAL_BADGE = (
  <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
);

const SELECT_BG =
  "appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat";

export const RecruitEntryPage: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState<FormStep>('input');
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<EntryData>(INITIAL_DATA);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [careerFile, setCareerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const careerInputRef = useRef<HTMLInputElement>(null);

  // 採用ページから ?job=xr 等で来た場合は応募職種を初期選択
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const job = params.get('job');
    if (job && JOB_ID_MAP[job]) {
      setFormData(prev => ({ ...prev, desiredJob: JOB_ID_MAP[job] }));
    }
  }, [location.search]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (file: File | null, setter: (f: File | null) => void) => {
    if (!file) {
      setter(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('ファイルサイズは2MB以内にしてください。');
      return;
    }
    setter(file);
  };

  const goToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    const timeTaken = (Date.now() - startTime) / 1000;
    if (timeTaken < 3) {
      console.warn('Submission too fast, likely a bot.');
    }

    setStep('confirm');
    window.scrollTo(0, 0);
  };

  const goBackToInput = () => {
    setStep('input');
    window.scrollTo(0, 0);
  };

  const birthdate =
    formData.birthYear && formData.birthMonth && formData.birthDay
      ? `${formData.birthYear}年${formData.birthMonth}月${formData.birthDay}日`
      : '';

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const files: { filename: string; content: string }[] = [];
      if (resumeFile) {
        files.push({ filename: `履歴書_${resumeFile.name}`, content: await fileToBase64(resumeFile) });
      }
      if (careerFile) {
        files.push({ filename: `職務経歴書_${careerFile.name}`, content: await fileToBase64(careerFile) });
      }

      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'recruit_entry',
          desiredJob: formData.desiredJob,
          employmentType: formData.employmentType,
          name: formData.name,
          furigana: formData.furigana,
          email: formData.email,
          phone: formData.phone,
          birthdate,
          address: formData.address,
          skills: formData.skills,
          motivation: formData.motivation,
          portfolio: formData.portfolio,
          referralSource: formData.referralSource,
          files,
          confirm_email_field: formData.confirm_email_field,
          _t: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました。');
      }

      setStep('complete');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Submission error:', error);
      alert('申し訳ありません。送信中にエラーが発生しました。ファイルサイズが大きい場合は2MB以内に調整いただくか、時間をおいて再度お試しください。');
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
            { id: 'complete', step: '03', label: '完了' },
          ].map((item, idx) => {
            const isActive = step === item.id;
            const isDone =
              (step === 'confirm' && item.id === 'input') || step === 'complete';
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

  const renderFileField = (
    file: File | null,
    setter: (f: File | null) => void,
    inputRef: React.RefObject<HTMLInputElement>,
    hint: string
  ) => (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null, setter)}
      />
      {file ? (
        <div className="flex items-center justify-between gap-3 w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 bg-blue-50/40">
          <span className="text-sm font-bold text-gray-800 truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => {
              setter(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="ファイルを削除"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0] || null, setter);
          }}
          className="flex flex-col items-center justify-center gap-2 w-full max-w-md border border-dashed border-gray-300 rounded-lg px-4 py-6 bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-colors text-center"
        >
          <UploadCloud className="w-7 h-7 text-blue-400" />
          <span className="text-sm font-bold text-blue-600">
            ファイルを選択 <span className="text-gray-400 font-medium">または ドラッグ＆ドロップ</span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium">{hint}</span>
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <PageHero titleEn="RECRUIT ENTRY" titleJa="採用エントリー" />
      {renderStepIndicator()}

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">

            {/* STEP 1: INPUT */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-8 text-center space-y-1">
                  <p className="text-sm text-gray-600 font-bold">Meta Heroesの未来を共に創る仲間を募集しています。</p>
                  <p className="text-sm text-gray-500 font-bold">以下のフォームに必要事項をご入力の上、エントリーしてください。</p>
                </div>

                {/* Notice */}
                <div className="mb-12 max-w-2xl mx-auto border border-blue-100 bg-blue-50/40 rounded-lg py-6 px-6 text-center">
                  <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase block mb-3">Notice</span>
                  <p className="text-xs text-blue-700 font-bold leading-[1.9]">
                    必須項目は必ずご入力ください。<br />
                    ご入力いただいた情報は、採用選考の目的でのみ使用いたします。
                  </p>
                </div>

                <form className="space-y-0 border-t-2 border-gray-900" onSubmit={goToConfirm}>
                  {/* Honeypot */}
                  <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <input type="text" name="confirm_email_field" value={formData.confirm_email_field} onChange={handleInputChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  {/* 応募職種 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">応募職種</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="desiredJob" value={formData.desiredJob} onChange={handleInputChange} className={`w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG}`} required>
                        <option value="">選択してください</option>
                        {JOB_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* 希望雇用形態 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">希望雇用形態</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className={`w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG}`} required>
                        <option value="">選択してください</option>
                        {EMPLOYMENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* お名前 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">お名前</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="例）山田 太郎" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* ふりがな */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">ふりがな</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="furigana" value={formData.furigana} onChange={handleInputChange} placeholder="例）やまだ たろう" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* メールアドレス */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">メールアドレス</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="例）example@meta-heroes.co.jp" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* 電話番号 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">電話番号</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="例）090-1234-5678（ハイフンあり）" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* 生年月日 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">生年月日</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <div className="flex flex-wrap gap-3">
                        <select name="birthYear" value={formData.birthYear} onChange={handleInputChange} className={`border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG} pr-10`} required>
                          <option value="">年を選択</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
                        </select>
                        <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} className={`border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG} pr-10`} required>
                          <option value="">月を選択</option>
                          {MONTHS.map(m => <option key={m} value={m}>{m}月</option>)}
                        </select>
                        <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} className={`border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG} pr-10`} required>
                          <option value="">日を選択</option>
                          {DAYS.map(d => <option key={d} value={d}>{d}日</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 住所 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">住所</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="例）東京都港区○○・1-1-1" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" required /></div>
                  </div>

                  {/* 保有スキル・経験 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                      <span className="mt-1">{REQUIRED_BADGE}</span>
                      <span className="font-bold text-gray-900 text-sm">保有スキル・経験</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><textarea name="skills" value={formData.skills} onChange={handleInputChange} rows={6} placeholder="保有できる言語やツール、携わったプロジェクトなどをご記入ください。" className="w-full border border-gray-300 py-3.5 px-4 outline-none font-bold resize-none" required /></div>
                  </div>

                  {/* 志望動機・自己PR */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                      <span className="mt-1">{REQUIRED_BADGE}</span>
                      <span className="font-bold text-gray-900 text-sm">志望動機・自己PR</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><textarea name="motivation" value={formData.motivation} onChange={handleInputChange} rows={6} placeholder="当社を志望する理由や、あなたの強み・実績をご記入ください。" className="w-full border border-gray-300 py-3.5 px-4 outline-none font-bold resize-none" required /></div>
                  </div>

                  {/* ポートフォリオURL / SNS */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {OPTIONAL_BADGE}
                      <span className="font-bold text-gray-900 text-sm">ポートフォリオURL / SNS</span>
                    </label>
                    <div className="px-8 py-8 bg-white"><input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="例）https://portfolio.example.com" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" /></div>
                  </div>

                  {/* 履歴書 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">履歴書</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      {renderFileField(resumeFile, setResumeFile, resumeInputRef, 'PDF / Word / 画像（2MB以内）')}
                    </div>
                  </div>

                  {/* 職務経歴書 */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {OPTIONAL_BADGE}
                      <span className="font-bold text-gray-900 text-sm">職務経歴書</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      {renderFileField(careerFile, setCareerFile, careerInputRef, 'PDF / Word（2MB以内）')}
                    </div>
                  </div>

                  {/* Meta Heroesを知ったきっかけ */}
                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      {REQUIRED_BADGE}
                      <span className="font-bold text-gray-900 text-sm">Meta Heroesを知ったきっかけ</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="referralSource" value={formData.referralSource} onChange={handleInputChange} className={`w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold ${SELECT_BG}`} required>
                        <option value="">選択してください</option>
                        {REFERRAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* 同意 + 送信 */}
                  <div className="py-20 text-center space-y-10">
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      ご入力いただいた個人情報は、採用選考の目的でのみ利用し、<br className="hidden md:block" />
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
                  <ConfirmRow label="応募職種" value={formData.desiredJob} />
                  <ConfirmRow label="希望雇用形態" value={formData.employmentType} />
                  <ConfirmRow label="お名前" value={formData.name} />
                  <ConfirmRow label="ふりがな" value={formData.furigana} />
                  <ConfirmRow label="メールアドレス" value={formData.email} />
                  <ConfirmRow label="電話番号" value={formData.phone} />
                  <ConfirmRow label="生年月日" value={birthdate} />
                  <ConfirmRow label="住所" value={formData.address} />
                  <ConfirmRow label="保有スキル・経験" value={formData.skills} />
                  <ConfirmRow label="志望動機・自己PR" value={formData.motivation} />
                  {formData.portfolio && <ConfirmRow label="ポートフォリオURL / SNS" value={formData.portfolio} />}
                  <ConfirmRow label="履歴書" value={resumeFile ? resumeFile.name : '未添付'} />
                  <ConfirmRow label="職務経歴書" value={careerFile ? careerFile.name : '未添付'} />
                  <ConfirmRow label="Meta Heroesを知ったきっかけ" value={formData.referralSource} />
                </div>
                <div className="py-20 flex flex-col items-center gap-6">
                  <button onClick={handleFinalSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center px-20 py-5 bg-blue-600 text-white text-sm font-black tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all min-w-[340px] disabled:opacity-60">
                    {isSubmitting ? '送信中...' : 'この内容でエントリーする'}
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
                <h2 className="text-3xl font-black text-gray-900 tracking-wider">エントリー完了</h2>
                <div className="space-y-4 text-gray-600 font-bold leading-relaxed">
                  <p>この度はエントリーいただき、誠にありがとうございます。<br />ご入力内容の控えをメールでお送りしましたのでご確認ください。</p>
                  <p className="text-sm text-gray-400">※メールが届かない場合は、迷惑メールフォルダをご確認いただくか、<br />再度エントリーをお願いいたします。</p>
                </div>
                <div className="pt-12">
                  <Link to="/recruit" className="inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-black tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                    採用情報へ戻る
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
