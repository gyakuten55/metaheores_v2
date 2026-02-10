import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { PdfThumbnail } from '../components/PdfThumbnail';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';

type FormStep = 'select' | 'input';

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

export const DocumentRequestPage: React.FC = () => {
  const [step, setStep] = useState<FormStep>('select');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    alert('お役立ち資料ページは現在準備中です。');
    window.location.href = '/';
  }, []);

  // Form Loader
  useEffect(() => {
    if (step === 'input') {
      setLoadingForm(true);
      
      const initForm = () => {
        const hbspt = (window as any).hbspt;
        const container = document.getElementById('hubspot-form-container');

        if (hbspt && container) {
          container.innerHTML = '';
          try {
            hbspt.forms.create({
              region: "na2",
              portalId: "243129625",
              formId: "5e03bb7b-49a7-43cb-8644-9fa906c55a3a",
              target: "#hubspot-form-container",
              onFormReady: () => {
                setLoadingForm(false);
              }
            });

            // Listen for HubSpot message indicating successful submission
            const handleMessage = (event: MessageEvent) => {
              if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
                console.log('HubSpot Form Submitted:', event.data);

                if (event.data.id === '5e03bb7b-49a7-43cb-8644-9fa906c55a3a') {
                  // Extract values robustly
                  const data = event.data.data;
                  let email = '';
                  let firstName = '';
                  let lastName = '';
                  let company = '';

                  // Handle different data structures
                  if (data.submissionValues) {
                    // Pattern 1: submissionValues object
                    email = data.submissionValues.email;
                    firstName = data.submissionValues.firstname;
                    lastName = data.submissionValues.lastname;
                    company = data.submissionValues.company;
                  } else if (Array.isArray(data)) {
                    // Pattern 2: Array of { name, value }
                    const getVal = (name: string) => data.find((f: any) => f.name === name)?.value;
                    email = getVal('email');
                    firstName = getVal('firstname');
                    lastName = getVal('lastname');
                    company = getVal('company');
                  } else {
                    // Pattern 3: Direct object
                    email = data.email;
                    firstName = data.firstname;
                    lastName = data.lastname;
                    company = data.company;
                  }

                  const fullName = `${lastName || ''} ${firstName || ''}`.trim() || 'お客様';
                  
                  console.log('Extracted Data:', { email, fullName, company });

                  const selectedFiles = DOCUMENTS
                    .filter(doc => selectedDocIds.includes(doc.id))
                    .map(doc => doc.fileName);

                  if (email && selectedFiles.length > 0) {
                    fetch('/api/send-mail', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'document_request',
                        name: fullName,
                        email: email,
                        company: company,
                        documentFiles: selectedFiles,
                        content: `HubSpot資料請求（サイト連携）\n資料: ${selectedFiles.join(', ')}`
                      })
                    })
                    .then(res => {
                        if (res.ok) console.log('Email API triggered successfully');
                        else console.error('Email API returned error', res.status);
                    })
                    .catch(err => console.error('Email trigger failed:', err));
                  } else {
                      console.warn('Missing email or no files selected', { email, files: selectedFiles.length });
                  }
                }
              }
            };

            window.addEventListener('message', handleMessage);
            return () => window.removeEventListener('message', handleMessage);
          } catch (e) {
            console.error('HubSpot Error:', e);
            setLoadingForm(false);
          }
        } else {
          setTimeout(initForm, 100);
        }
      };

      initForm();
    }
  }, [step, selectedDocIds]);

  const toggleDocument = (id: string) => {
    setSelectedDocIds(prev => prev.includes(id)
      ? prev.filter(itemId => itemId !== id)
      : [...prev, id]
    );
  };

  const renderStepIndicator = () => (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl py-8 md:py-12">
        <div className="flex items-center justify-center">
          {[ 
            { id: 'select', step: '01', label: '資料選択' },
            { id: 'input', step: '02', label: 'お客様情報入力' }
          ].map((item, idx) => {
            const isActive = step === item.id;
            const isDone = step === 'input' && idx === 0;

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
                {idx < 1 && (
                  <div className={`w-12 md:w-24 h-px mx-4 md:mx-8 mt-4 md:mt-5 transition-colors duration-500 ${isDone ? 'bg-blue-600' : 'bg-gray-200'}`} />
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
      <PageHero titleEn="DOCUMENT" titleJa="お役立ち資料" />
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
                {['ai', 'egg', 'metaverse'].map(cat => {
                  const categoryDocs = DOCUMENTS.filter(doc => doc.category === cat);
                  if (categoryDocs.length === 0) return null;
                  
                  return (
                    <div key={cat} className="mb-16 last:mb-0">
                      <div className="flex items-center gap-4 mb-8">
                        <h4 className="text-lg font-black text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-widest">
                          {cat === 'ai' ? 'AI事業' : cat === 'egg' ? 'HERO EGG' : 'メタバース・XR'}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryDocs.map(doc => {
                          const isSelected = selectedDocIds.includes(doc.id);
                          return (
                            <div 
                              key={doc.id}
                              onClick={() => toggleDocument(doc.id)}
                              className={`group cursor-pointer relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${isSelected ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                              {isSelected && (
                                <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                  <Check size={20} strokeWidth={4} />
                                </div>
                              )}
                              <PdfThumbnail 
                                url={doc.pdfUrl} 
                                title={doc.title}
                                className={isSelected ? 'scale-105' : 'group-hover:scale-105 transition-transform duration-700'}
                              />
                              <div className="p-5 bg-white relative z-10">
                                <h5 className="text-sm font-black text-gray-900 mb-2 leading-tight min-h-[2.5rem] line-clamp-2">{doc.title}</h5>
                                <p className="text-[10px] font-bold text-gray-400 line-clamp-2 leading-relaxed">{doc.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">選択中:</span>
                    <span className="text-lg font-black text-blue-600">{selectedDocIds.length} 件</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (selectedDocIds.length > 0) {
                        setStep('input');
                        window.scrollTo(0, 0);
                      } else {
                        alert('資料を1つ以上選択してください。');
                      }
                    }}
                    disabled={selectedDocIds.length === 0}
                    className={`inline-flex items-center justify-center px-20 py-5 text-sm font-black tracking-[0.3em] transition-all duration-500 min-w-[340px] rounded-full shadow-xl ${selectedDocIds.length > 0 ? 'bg-gray-900 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    入力画面へ進む
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: INPUT (HubSpot Form) */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-12 text-center">
                  <button onClick={() => setStep('select')} className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={14} /> 資料選択に戻る
                  </button>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">お客様情報をご入力ください</h3>
                  <p className="text-sm text-gray-500 font-bold">以下のフォームに入力後、送信してください。</p>
                </div>
                
                <div className="bg-gray-50 p-6 md:p-12 rounded-3xl border border-gray-100 shadow-inner min-h-[400px] relative flex flex-col items-center justify-center">
                  {loadingForm && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-blue-600" size={40} />
                      <p className="text-sm font-bold text-gray-400">フォームを読み込んでいます...</p>
                    </div>
                  )}
                  <div id="hubspot-form-container" className={`w-full ${loadingForm ? 'hidden' : 'block'}`}></div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto">
                    ※送信後、ご入力いただいたメールアドレス宛に資料ダウンロードのご案内が自動送信されます。<br/>
                    メールが届かない場合は、大変お手数ですが迷惑メールフォルダをご確認いただくか、お問い合わせください。
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};