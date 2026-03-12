import React, { useEffect, useState } from 'react';
import { PageHero } from '../components/PageHero';
import { Link } from 'react-router-dom';
import { getBlogs, Blog } from '../lib/microcms';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Mail, Home, ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';

const SPEAKING_STYLES = [
  { name: '講演', image: '/assets/services/speaking/lecture.jpg' },
  { name: 'パネルディスカッション', image: '/assets/services/speaking/panel-discussion.jpg' },
  { name: 'セミナー/勉強会', image: '/assets/services/speaking/seminar.jpg' },
  { name: 'ワークショップ', image: '/assets/services/speaking/workshop.jpg' },
  { name: 'フォーラム/シンポジウム', image: '/assets/services/speaking/forum.jpg' },
  { name: 'オンライン/オフライン/ハイブリッド', image: '/assets/services/speaking/online-hybrid.jpg' },
];

const PRICING_PLANS = [
  {
    tag: 'Online',
    name: 'ウェビナー・研修',
    price: '200,000',
    duration: '60分オンライン',
    description: '「知識のインプット」に特化。Zoom等を使用したオンライン講演。AIリスキリングやメタバース概論など、社内研修や広域への配信イベントに最適です。',
    note: '※アーカイブ配信利用権を含みます。',
  },
  {
    tag: 'Standard',
    name: '講演・セミナー',
    price: '350,000',
    duration: '60〜90分現地登壇',
    description: '「熱量とビジョン」を共有。カンファレンスの講演や、全社イベントなどに。会場の空気を掴み、参加者のモチベーションを高めるプレゼンテーションを行います。',
    note: '※交通費・宿泊費は別途となります。',
  },
  {
    tag: 'Practical',
    name: 'ワークショップ・実践',
    price: '600,000',
    duration: '半日(3~4h)現地開催',
    description: '「体験」を通じた深い理解。講演に加え、実際に生成AIを触る、Hero Eggでワールドを作るなどの実指導を含みます。',
    note: '※講師1名＋サポートスタッフ1名体制の目安です。',
  },
  {
    tag: 'Premium',
    name: 'イベント共創',
    price: '1,000,000',
    duration: '1日〜期間応相談',
    description: '「イベントそのもの」をプロデュース。登壇だけでなく、体験ブースの設置、子供向けアイデアソン運営など、イベントの目玉コンテンツとして全面的に協力します。',
    note: '※機材手配費・運営費を含みます。',
  },
];

const SPEAKER_IMAGES_ROW1 = [
  '/assets/services/speaking/speaker/speaker-1.png',
  '/assets/services/speaking/speaker/speaker-2.png',
  '/assets/services/speaking/speaker/speaker-3.png',
  '/assets/services/speaking/speaker/speaker-4.png',
  '/assets/services/speaking/speaker/speaker-1.png',
  '/assets/services/speaking/speaker/speaker-2.png',
  '/assets/services/speaking/speaker/speaker-3.png',
  '/assets/services/speaking/speaker/speaker-4.png',
];

const SPEAKER_IMAGES_ROW2 = [
  '/assets/services/speaking/speaker/speaker-8.png',
  '/assets/services/speaking/speaker/speaker-9.png',
  '/assets/services/speaking/speaker/speaker-10.png',
  '/assets/services/speaking/speaker/speaker-8.png',
  '/assets/services/speaking/speaker/speaker-9.png',
  '/assets/services/speaking/speaker/speaker-10.png',
];

const SPEAKING_PDF_FILENAME = '【be HEROES】講演・登壇パッケージ.pdf';

const STYLE_OPTIONS = ['講演', 'パネルディスカッション', 'セミナー/勉強会', 'ワークショップ', 'フォーラム/シンポジウム', 'オンライン/オフライン/ハイブリッド'];
const PLAN_OPTIONS = [
  { value: 'online', label: '【Online】ウェビナー・研修（200,000円〜）' },
  { value: 'standard', label: '【Standard】講演・セミナー（350,000円〜）' },
  { value: 'practical', label: '【Practical】ワークショップ・実践（600,000円〜）' },
  { value: 'premium', label: '【Premium】イベント共創（1,000,000円〜）' },
  { value: 'undecided', label: '未定・相談したい' },
];

interface SpeakingFormData {
  plan: string;
  style: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  content: string;
  confirm_email_field: string;
}

const INITIAL_SPEAKING_FORM: SpeakingFormData = {
  plan: '',
  style: '',
  company: '',
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  content: '',
  confirm_email_field: '',
};

type DocFormStep = 'form' | 'thanks';
type SpeakingFormStep = 'input' | 'confirm' | 'complete';

export const SpeakingPage: React.FC = () => {
  const [news, setNews] = useState<Blog[]>([]);
  const [formStep, setFormStep] = useState<DocFormStep>('form');
  const [loadingForm, setLoadingForm] = useState(false);

  // Speaking request form
  const [speakingStep, setSpeakingStep] = useState<SpeakingFormStep>('input');
  const [speakingForm, setSpeakingForm] = useState<SpeakingFormData>(INITIAL_SPEAKING_FORM);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpeakingForm(prev => ({ ...prev, [name]: value }));
  };

  const goToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setSpeakingStep('confirm');
    document.getElementById('speaking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitSpeaking = async () => {
    setIsSubmitting(true);
    const timeTaken = (Date.now() - startTime) / 1000;
    if (timeTaken < 3) {
      console.warn('Submission too fast, likely a bot.');
    }

    const planLabel = PLAN_OPTIONS.find(p => p.value === speakingForm.plan)?.label || speakingForm.plan;
    const contentBody = [
      `【希望プラン】: ${planLabel}`,
      `【希望形式】: ${speakingForm.style || '未選択'}`,
      `【電話番号】: ${speakingForm.phone || '---'}`,
      `【希望日程】: ${speakingForm.eventDate || '未定'}`,
      '',
      `【ご依頼内容】:`,
      speakingForm.content,
    ].join('\n');

    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'speaking',
          company: speakingForm.company,
          name: speakingForm.name,
          email: speakingForm.email,
          content: contentBody,
          confirm_email_field: speakingForm.confirm_email_field,
          _t: Date.now(),
        }),
      });
      if (!response.ok) throw new Error('送信に失敗しました。');
      setSpeakingStep('complete');
      document.getElementById('speaking-form')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      alert('申し訳ありません。送信中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await getBlogs(4, undefined, {
          categoryId: 'セミナー・ウェビナー・講演・登壇 実績',
        });
        setNews(newsData.contents);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };
    fetchData();
  }, []);

  // HubSpot form for document request
  useEffect(() => {
    if (formStep !== 'form') return;

    const container = document.getElementById('speaking-hubspot-form');
    if (!container) return;

    setLoadingForm(true);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
        if (event.data.id === '5e03bb7b-49a7-43cb-8644-9fa906c55a3a') {
          const data = event.data.data;
          let email = '';
          let firstName = '';
          let lastName = '';
          let company = '';

          if (data.submissionValues) {
            email = data.submissionValues.email;
            firstName = data.submissionValues.firstname;
            lastName = data.submissionValues.lastname;
            company = data.submissionValues.company;
          } else if (Array.isArray(data)) {
            const getVal = (name: string) => data.find((f: any) => f.name === name)?.value;
            email = getVal('email');
            firstName = getVal('firstname');
            lastName = getVal('lastname');
            company = getVal('company');
          } else {
            email = data.email;
            firstName = data.firstname;
            lastName = data.lastname;
            company = data.company;
          }

          const fullName = `${lastName || ''} ${firstName || ''}`.trim() || 'お客様';

          if (email) {
            fetch('/api/send-mail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'document_request',
                name: fullName,
                email,
                company,
                documentFiles: [SPEAKING_PDF_FILENAME],
                content: `講演・登壇パッケージ資料請求（サイト連携）\n資料: ${SPEAKING_PDF_FILENAME}`,
              }),
            })
              .then((res) => {
                if (res.ok) console.log('Email API triggered successfully');
                else console.error('Email API returned error', res.status);
              })
              .catch((err) => console.error('Email trigger failed:', err));
          }

          setFormStep('thanks');
          window.scrollTo({ top: document.getElementById('document-request')?.offsetTop || 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const initForm = () => {
      const hbspt = (window as any).hbspt;
      if (hbspt && container) {
        container.innerHTML = '';
        try {
          hbspt.forms.create({
            region: 'na2',
            portalId: '243129625',
            formId: '5e03bb7b-49a7-43cb-8644-9fa906c55a3a',
            target: '#speaking-hubspot-form',
            inlineMessage: '送信完了',
            onFormReady: () => setLoadingForm(false),
            onFormSubmitted: () => {
              setFormStep('thanks');
              window.scrollTo({ top: document.getElementById('document-request')?.offsetTop || 0, behavior: 'smooth' });
            },
          });
        } catch (e) {
          console.error('HubSpot Error:', e);
          setLoadingForm(false);
        }
      } else {
        setTimeout(initForm, 100);
      }
    };

    initForm();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [formStep]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <PageHero titleEn="SPEAKING" titleJa="講演・登壇" />

      <div className="container mx-auto px-4 max-w-5xl space-y-32 mt-20 md:mt-32">

        {/* Speaking Styles */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">SPEAKING STYLES</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">登壇形式</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <p className="mb-12 text-gray-600 leading-relaxed font-medium text-sm md:text-base tracking-wide">
            ご要望に合わせて柔軟に対応可能な、6つの登壇スタイルをご用意しています。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {SPEAKING_STYLES.map((style, idx) => (
              <div key={idx} className="group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs md:text-sm font-bold text-gray-700 text-center tracking-wide">
                  {style.name}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Speaker Gallery - full width */}
      <section className="mt-32">
        <div className="container mx-auto px-4 max-w-5xl mb-12">
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">SPEAKER</span>
          <div className="flex flex-col items-start">
            <h3 className="text-2xl md:text-3xl font-black text-gray-800">登壇者</h3>
            <div className="w-full h-px bg-gray-100 relative mt-6">
              <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden space-y-2">
          {/* Row 1: slides from right */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-scroll-left">
              {[...SPEAKER_IMAGES_ROW1, ...SPEAKER_IMAGES_ROW1].map((src, idx) => (
                <img key={idx} src={src} alt={`登壇写真 ${(idx % SPEAKER_IMAGES_ROW1.length) + 1}`} className="h-[180px] md:h-[240px] w-auto flex-shrink-0 rounded-lg px-1" />
              ))}
            </div>
          </div>

          {/* Row 2: slides from left */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-scroll-right">
              {[...SPEAKER_IMAGES_ROW2, ...SPEAKER_IMAGES_ROW2].map((src, idx) => (
                <img key={idx} src={src} alt={`登壇写真 ${(idx % SPEAKER_IMAGES_ROW2.length) + 6}`} className="h-[180px] md:h-[240px] w-auto flex-shrink-0 rounded-lg px-1" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl space-y-32 mt-32">
        {/* Pricing */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">PRICING</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">料金プラン（参考）</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {PRICING_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-center mb-4">
                  <span className="text-[10px] font-black text-blue-600 tracking-[0.15em] uppercase">
                    【{plan.tag}】
                  </span>
                  <h4 className="text-base md:text-lg font-black text-gray-900 mt-1">
                    {plan.name}
                  </h4>
                </div>

                <div className="w-full h-px bg-gray-100 mb-4" />

                <div className="text-center mb-1">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">料金（税別）</span>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl md:text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm font-bold text-gray-900">円〜</span>
                </div>

                <div className="text-center mb-4">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-1">時間 / 形式</span>
                  <span className="text-sm font-bold text-gray-800">{plan.duration}</span>
                </div>

                <div className="w-full h-px bg-gray-100 mb-4" />

                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider block mb-2">内容・特徴</span>
                  <p className="text-[11px] md:text-xs text-gray-600 leading-[1.9] font-medium tracking-wide">
                    {plan.description}
                  </p>
                </div>

                <p className="text-[10px] text-gray-400 font-medium mt-3 leading-relaxed">
                  {plan.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Case Study - News */}
        <section>
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">CASE STUDY</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">登壇事例</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {news.length > 0
              ? news.map((item) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group block">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4 border border-gray-50 shadow-sm">
                      <img
                        src={item.eyecatch?.url || '/assets/services/speaking/lecture.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-300 font-bold tracking-widest">
                      {formatDate(item.publishedAt)}
                    </p>
                  </Link>
                ))
              : [1, 2, 3, 4].map((n) => (
                  <div key={n} className="group block animate-pulse">
                    <div className="aspect-video rounded-lg bg-gray-100 mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                ))}
          </div>

          <div className="text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-10 py-3 bg-gray-800 text-white text-xs font-bold rounded-full hover:bg-black transition-colors shadow-md"
            >
              もっと見る
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Speaking Request Form */}
        <section id="speaking-form">
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">REQUEST</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">講演依頼フォーム</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: INPUT */}
            {speakingStep === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <p className="mb-8 text-gray-600 leading-relaxed font-medium text-sm md:text-base tracking-wide">
                  以下のフォームに必要事項をご入力ください。内容を確認の上、担当者よりご連絡いたします。
                </p>
                <form className="border-t-2 border-gray-900" onSubmit={goToConfirm}>
                  {/* Honeypot */}
                  <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <input type="text" name="confirm_email_field" value={speakingForm.confirm_email_field} onChange={handleFormChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">希望プラン</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="plan" value={speakingForm.plan} onChange={handleFormChange} required className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat">
                        <option value="">選択してください</option>
                        {PLAN_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
                      <span className="font-bold text-gray-900 text-sm">希望の登壇形式</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <select name="style" value={speakingForm.style} onChange={handleFormChange} className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat">
                        <option value="">選択してください</option>
                        {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">貴社名 / 組織名</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="text" name="company" value={speakingForm.company} onChange={handleFormChange} placeholder="株式会社MetaHeroes" required className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">お名前</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="text" name="name" value={speakingForm.name} onChange={handleFormChange} placeholder="Meta 太郎" required className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">必須</span>
                      <span className="font-bold text-gray-900 text-sm">メールアドレス</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="email" name="email" value={speakingForm.email} onChange={handleFormChange} placeholder="example@meta-heroes.co.jp" required className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
                      <span className="font-bold text-gray-900 text-sm">電話番号</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="tel" name="phone" value={speakingForm.phone} onChange={handleFormChange} placeholder="03-1234-5678" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-center gap-3">
                      <span className="bg-gray-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">任意</span>
                      <span className="font-bold text-gray-900 text-sm">希望日程</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <input type="text" name="eventDate" value={speakingForm.eventDate} onChange={handleFormChange} placeholder="2026年5月頃 / 未定" className="w-full max-w-md border border-gray-300 py-3.5 px-4 outline-none font-bold" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
                    <label className="bg-gray-50 px-8 py-8 flex items-start gap-3 pt-10">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm mt-1">必須</span>
                      <span className="font-bold text-gray-900 text-sm">ご依頼内容</span>
                    </label>
                    <div className="px-8 py-8 bg-white">
                      <textarea name="content" value={speakingForm.content} onChange={handleFormChange} rows={8} placeholder="イベントの概要、参加者の属性、ご希望のテーマなどをご記入ください。" required className="w-full border border-gray-300 py-3.5 px-4 outline-none font-bold resize-none" />
                    </div>
                  </div>

                  <div className="py-20 text-center space-y-10">
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      ご入力いただいた個人情報は、講演依頼への対応および情報提供のためにのみ利用いたします。<br className="hidden md:block" />
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
                      <button type="submit" disabled={!agreed} className={`inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] border-2 ${agreed ? 'bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-gray-900' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}>
                        内容を確認する<ChevronRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: CONFIRM */}
            {speakingStep === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-8 text-center">
                  <p className="text-sm text-gray-500 font-bold">入力内容をご確認ください。よろしければ「送信する」ボタンを押してください。</p>
                </div>
                <div className="border-t-2 border-gray-900 bg-gray-50/30">
                  <SpeakingConfirmRow label="希望プラン" value={PLAN_OPTIONS.find(p => p.value === speakingForm.plan)?.label || ''} />
                  <SpeakingConfirmRow label="希望の登壇形式" value={speakingForm.style} />
                  <SpeakingConfirmRow label="貴社名 / 組織名" value={speakingForm.company} />
                  <SpeakingConfirmRow label="お名前" value={speakingForm.name} />
                  <SpeakingConfirmRow label="メールアドレス" value={speakingForm.email} />
                  <SpeakingConfirmRow label="電話番号" value={speakingForm.phone} />
                  <SpeakingConfirmRow label="希望日程" value={speakingForm.eventDate} />
                  <SpeakingConfirmRow label="ご依頼内容" value={speakingForm.content} />
                </div>
                <div className="py-20 flex flex-col items-center gap-6">
                  <button onClick={handleSubmitSpeaking} disabled={isSubmitting} className="inline-flex items-center justify-center px-20 py-5 bg-blue-600 text-white text-sm font-black tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all min-w-[340px]">
                    {isSubmitting ? '送信中...' : 'この内容で送信する'}
                    {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                  </button>
                  <button onClick={() => { setSpeakingStep('input'); document.getElementById('speaking-form')?.scrollIntoView({ behavior: 'smooth' }); }} disabled={isSubmitting} className="inline-flex items-center justify-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="mr-1 w-4 h-4" /> 入力画面に戻る
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: COMPLETE */}
            {speakingStep === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-3xl font-black text-gray-900 tracking-wider">送信完了</h4>
                <div className="space-y-4 text-gray-600 font-bold leading-relaxed">
                  <p>講演依頼のお問い合わせありがとうございました。<br />内容を確認の上、担当者より折り返しご連絡いたします。</p>
                  <p className="text-sm text-gray-400">※送信内容の控えをメールでお送りしましたのでご確認ください。</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Document Request */}
        <section id="document-request">
          <div className="mb-12">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">DOCUMENT REQUEST</span>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">資料請求</h3>
              <div className="w-full h-px bg-gray-100 relative mt-6">
                <div className="absolute top-0 left-0 w-16 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
            </div>
          </div>

          <p className="mb-8 text-gray-600 leading-relaxed font-medium text-sm md:text-base tracking-wide">
            講演・登壇パッケージの詳細資料をお送りします。以下のフォームにご入力ください。
          </p>

          <AnimatePresence mode="wait">
            {formStep === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-gray-50 p-6 md:p-12 rounded-2xl border border-gray-100 min-h-[400px] relative flex flex-col items-center justify-center">
                  {loadingForm && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-blue-600" size={40} />
                      <p className="text-sm font-bold text-gray-400">フォームを読み込んでいます...</p>
                    </div>
                  )}
                  <div id="speaking-hubspot-form" className={`w-full ${loadingForm ? 'hidden' : 'block'}`} />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto">
                    ※送信後、ご入力いただいたメールアドレス宛に資料をお送りします。<br />
                    メールが届かない場合は、迷惑メールフォルダをご確認いただくか、お問い合わせください。
                  </p>
                </div>
              </motion.div>
            )}

            {formStep === 'thanks' && (
              <motion.div key="thanks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center py-12 md:py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8">
                    <CheckCircle className="text-green-500" size={48} strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">送信が完了しました</h3>
                  <p className="text-sm md:text-base text-gray-500 font-bold leading-relaxed max-w-xl mx-auto mb-8">
                    講演・登壇パッケージ資料のご請求ありがとうございます。
                  </p>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 max-w-lg mx-auto mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Mail className="text-blue-600" size={20} />
                      <span className="text-sm font-black text-blue-900">メールをご確認ください</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-700 font-bold leading-relaxed">
                      ご入力いただいたメールアドレス宛に、<br className="hidden md:inline" />
                      資料を添付したメールをお送りしております。<br />
                      届かない場合は迷惑メールフォルダをご確認ください。
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-12 py-4 bg-gray-900 text-white text-sm font-black tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all duration-500 shadow-xl"
                  >
                    <Home size={16} />
                    トップページへ戻る
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="bg-gray-50 mt-32">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
            <a
              href="#speaking-form"
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#333333] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">講演を依頼する</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </a>

            <a
              href="#document-request"
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#3b82f6] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">資料請求</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </a>

            <Link
              to="/contact"
              className="group relative flex items-center justify-between w-full md:w-[320px] px-8 py-5 bg-[#0ea5e9] text-white rounded-full overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-lg font-black tracking-wider">お問い合わせ</span>
              <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

const SpeakingConfirmRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid md:grid-cols-[280px,1fr] border-b border-gray-200">
    <div className="bg-gray-50 px-8 py-6 font-bold text-gray-500 text-sm tracking-wider flex items-center">{label}</div>
    <div className="px-8 py-6 bg-white font-black text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
      {value || '---'}
    </div>
  </div>
);
