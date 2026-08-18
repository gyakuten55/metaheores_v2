/**
 * IndustryCurriculum — 業種別カリキュラムページ v3
 * 修正: アンカーID修正・Scroll Spy・sticky offset・URLハッシュ更新・Dark Break高さ調整
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight } from "lucide-react";
import { url } from "@/lib/paths";

// Sticky header height + category bar height + extra padding
const SCROLL_OFFSET = 64 + 48 + 20; // globalNav + categoryBar + padding

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -10px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// Scroll to section with proper offset
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  // Update URL hash without triggering scroll
  window.history.replaceState(null, "", `#${id}`);
}

const darkBreaks: Record<number, string> = {
  2: "AIで変えられるのは、資料作成だけではない。",
  5: "人が判断し、AIが仕事を加速させる。",
  8: "業種が違っても、AI活用の本質は同じ。",
};

// IDs match the spec exactly
const industryCategories = [
  {
    id: "travel",
    name: "旅行・観光業",
    challenges: ["料金・行程の確認・整理に時間がかかる", "旅行企画・提案書の作成が属人化", "販促資料・媒体制作の工数が大きい"],
    aiUses: ["料金確認・行程整理の効率化", "旅行企画・提案書の初稿生成", "販促資料・媒体コンテンツの生成"],
    targets: ["旅行手配担当", "企画・営業担当", "販売・マーケティング担当"],
    purpose: "旅行業務の定型作業を効率化し、企画・提案・顧客対応の質を高める",
    curriculum: ["業務棚卸しとAI活用候補の整理", "料金・行程確認の効率化", "旅行企画・提案書の生成", "販促資料・コンテンツ制作", "顧客対応・フォローアップの効率化"],
    skills: ["情報整理・要約", "文書生成・編集", "コンテンツ制作", "提案書作成"],
    deliverables: ["旅行企画書（初稿）", "行程確認表", "販促コンテンツ"],
    before: "料金・行程・販促資料をそれぞれ手作業",
    after: "料金確認、行程整理、企画書、販促制作をAIで効率化",
  },
  {
    id: "retail-ec",
    name: "小売・EC",
    challenges: ["商品情報の整理・更新が大変", "販促コンテンツの量産が追いつかない", "顧客対応・問い合わせ対応の工数が大きい"],
    aiUses: ["商品説明・カタログの生成", "販促コンテンツ・SNS投稿の量産", "顧客対応・FAQ整備の効率化"],
    targets: ["商品管理担当", "販促・マーケティング担当", "顧客対応担当"],
    purpose: "商品情報・販促・顧客対応の効率化で、売上につながる業務に集中できる状態をつくる",
    curriculum: ["小売業務の棚卸しとAI活用候補", "商品情報・説明文の生成", "販促コンテンツの量産", "顧客対応・FAQ整備", "販売分析・レポートの効率化"],
    skills: ["商品説明生成", "コンテンツ量産", "顧客対応文生成", "データ分析補助"],
    deliverables: ["商品説明文（初稿）", "販促コンテンツ", "FAQ（初稿）"],
    before: "商品情報・販促資料をそれぞれ手作業で作成",
    after: "AIで商品説明・販促コンテンツを効率的に生成・更新",
  },
  {
    id: "manufacturing",
    name: "製造業",
    challenges: ["熟練者しか分からない手順・ノウハウが残る", "品質確認・異常値チェックに時間がかかる", "技能継承・現場教育の資料整備が追いつかない"],
    aiUses: ["手順書・マニュアルの整理・生成", "品質確認・異常候補の整理", "技能継承・教育資料の作成"],
    targets: ["製造・生産管理担当", "品質管理担当", "現場教育担当"],
    purpose: "熟練者の知識を標準化し、品質確認・技能継承の効率と精度を高める",
    curriculum: ["製造業務の棚卸しとAI活用候補", "手順書・マニュアルの整理・生成", "品質確認・異常候補の整理", "技能継承・教育資料の作成", "生産管理・報告の効率化"],
    skills: ["マニュアル作成", "品質確認補助", "情報構造化", "教育資料生成"],
    deliverables: ["作業マニュアル（初稿）", "品質確認表", "技能継承資料"],
    before: "熟練者しか分からない手順が残る",
    after: "手順・品質基準・ノウハウをAIで整理し、標準化・技能継承へ",
  },
  {
    id: "printing",
    name: "印刷・紙製品製造業",
    challenges: ["見積・仕様整理の確認に時間がかかる", "制作指示・校正の属人化", "生産管理・マニュアルの整備が追いつかない"],
    aiUses: ["見積・仕様書の確認・整理", "制作指示書・校正チェックリストの生成", "生産管理・マニュアルの整備"],
    targets: ["営業・見積担当", "制作・校正担当", "生産管理担当"],
    purpose: "見積・制作・生産管理の定型業務を効率化し、品質と納期の安定を図る",
    curriculum: ["印刷業務の棚卸しとAI活用候補", "見積・仕様整理の効率化", "制作指示・校正の効率化", "生産管理・報告の効率化", "マニュアル・標準化資料の整備"],
    skills: ["仕様整理・確認", "制作指示書生成", "校正チェック補助", "マニュアル作成"],
    deliverables: ["仕様確認表", "制作指示書（初稿）", "作業マニュアル"],
    before: "見積・仕様・制作指示をそれぞれ手作業で整理",
    after: "AIで確認・整理・指示書生成を効率化し、判断業務に集中",
  },
  {
    id: "construction",
    name: "建設・設備工事",
    challenges: ["現場書類・報告書の作成に時間がかかる", "安全管理・工程整理の属人化", "提案業務の資料作成が大変"],
    aiUses: ["現場書類・報告書の生成", "安全管理・工程整理の効率化", "提案書・見積資料の生成"],
    targets: ["現場監督・施工管理担当", "安全管理担当", "営業・提案担当"],
    purpose: "現場書類・報告・提案業務の効率化で、現場対応と品質管理に集中できる状態をつくる",
    curriculum: ["建設業務の棚卸しとAI活用候補", "現場書類・報告書の生成", "安全管理・工程整理の効率化", "提案書・見積資料の生成", "マニュアル・標準化資料の整備"],
    skills: ["書類生成・編集", "工程整理", "提案書作成", "安全管理補助"],
    deliverables: ["現場報告書（初稿）", "工程管理表", "提案書（初稿）"],
    before: "現場書類・報告書をゼロから手作業で作成",
    after: "AIで書類・報告書の初稿を生成し、確認・修正に集中",
  },
  {
    id: "real-estate",
    name: "不動産",
    challenges: ["物件情報の整理・更新が大変", "提案・顧客対応の資料作成が属人化", "契約確認・差分チェックに時間がかかる"],
    aiUses: ["物件説明・提案資料の生成", "顧客対応・フォローアップ文書の生成", "契約確認・差分整理の効率化"],
    targets: ["営業・仲介担当", "契約管理担当", "販促・マーケティング担当"],
    purpose: "物件情報・提案・契約業務の効率化で、顧客対応と成約率向上に集中できる状態をつくる",
    curriculum: ["不動産業務の棚卸しとAI活用候補", "物件説明・提案資料の生成", "顧客対応・フォローアップの効率化", "契約確認・差分整理", "販促コンテンツの生成"],
    skills: ["物件説明生成", "提案書作成", "契約確認補助", "顧客対応文生成"],
    deliverables: ["物件説明書（初稿）", "提案資料", "契約確認表"],
    before: "物件情報・提案資料をそれぞれ手作業で作成",
    after: "AIで物件説明・提案資料を効率的に生成・更新",
  },
  {
    id: "logistics",
    name: "物流・運輸",
    challenges: ["配車・運行管理の報告・整理が大変", "問い合わせ対応の工数が大きい", "業務マニュアルの整備が追いつかない"],
    aiUses: ["運行報告・業務日報の生成", "問い合わせ対応・回答案の生成", "業務マニュアルの整備"],
    targets: ["配車・運行管理担当", "顧客対応担当", "現場教育担当"],
    purpose: "報告・対応・マニュアル業務の効率化で、安全運行と顧客対応の質を高める",
    curriculum: ["物流業務の棚卸しとAI活用候補", "運行報告・業務日報の生成", "問い合わせ対応の効率化", "業務マニュアルの整備", "配車・工程整理の効率化"],
    skills: ["報告書生成", "問い合わせ対応文生成", "マニュアル作成", "情報整理"],
    deliverables: ["業務日報（初稿）", "回答テンプレート", "業務マニュアル"],
    before: "配車・運行・報告をそれぞれ手作業で整理",
    after: "AIで報告・対応・マニュアルを効率化し、現場対応に集中",
  },
  {
    id: "care-welfare",
    name: "介護・福祉",
    challenges: ["記録・申し送りの作成に時間がかかる", "研修資料・業務マニュアルの整備が追いつかない", "報告書・書類の作成が属人化"],
    aiUses: ["記録・申し送り文書の生成", "研修資料・マニュアルの整備", "報告書・書類の生成"],
    targets: ["介護・支援担当", "管理・教育担当", "事務・書類担当"],
    purpose: "記録・書類業務の効率化で、利用者対応と支援の質向上に集中できる状態をつくる",
    curriculum: ["介護業務の棚卸しとAI活用候補", "記録・申し送り文書の生成", "研修資料・マニュアルの整備", "報告書・書類の生成", "業務標準化・技能継承"],
    skills: ["記録文生成", "マニュアル作成", "報告書生成", "情報整理・構造化"],
    deliverables: ["申し送り文書（初稿）", "研修資料", "業務マニュアル"],
    before: "記録・申し送り・報告書を手作業で作成",
    after: "AIで記録・書類の初稿を生成し、確認・対応に集中",
  },
  {
    id: "hospitality-food",
    name: "宿泊・飲食",
    challenges: ["販促・予約対応の資料作成が大変", "接客マニュアルの整備が追いつかない", "運営情報・メニュー整理が属人化"],
    aiUses: ["販促コンテンツ・予約対応文の生成", "接客マニュアルの整備", "メニュー・運営情報の整理・生成"],
    targets: ["販促・マーケティング担当", "接客・フロント担当", "運営管理担当"],
    purpose: "販促・対応・マニュアル業務の効率化で、顧客体験と運営品質を高める",
    curriculum: ["宿泊・飲食業務の棚卸しとAI活用候補", "販促コンテンツの生成", "予約対応・接客支援の効率化", "マニュアル・運営情報の整備", "メニュー・情報整理の効率化"],
    skills: ["販促コンテンツ生成", "接客対応文生成", "マニュアル作成", "情報整理"],
    deliverables: ["販促コンテンツ", "接客マニュアル（初稿）", "メニュー説明文"],
    before: "販促・予約対応・マニュアルをそれぞれ手作業で作成",
    after: "AIで販促・対応・マニュアルを効率化し、顧客対応の質を高める",
  },
  {
    id: "event-media",
    name: "イベント・メディア",
    challenges: ["企画・台本・制作の工数が大きい", "広報・情報発信の資料作成が属人化", "進行管理・コンテンツ制作が追いつかない"],
    aiUses: ["企画・台本・コンテンツの初稿生成", "広報・情報発信資料の生成", "進行管理・コンテンツ制作の効率化"],
    targets: ["企画・制作担当", "広報・PR担当", "進行管理担当"],
    purpose: "企画・制作・広報業務の初速を上げ、コンテンツの質と量を両立させる",
    curriculum: ["イベント・メディア業務の棚卸しとAI活用候補", "企画・台本の生成", "広報・情報発信資料の生成", "コンテンツ制作の効率化", "進行管理・報告の効率化"],
    skills: ["企画・台本生成", "広報資料生成", "コンテンツ制作補助", "進行管理補助"],
    deliverables: ["企画書（初稿）", "台本・進行表", "広報資料"],
    before: "企画・台本・制作資料をゼロから手作業で作成",
    after: "AIで企画・台本・広報資料の初稿を生成し、クリエイティブ判断に集中",
  },
];

function IndustrySection({ cat, index }: { cat: typeof industryCategories[0]; index: number }) {
  const isAlt = index % 2 === 1;
  return (
    <div id={cat.id} className={`py-12 lg:py-16 border-b border-[#D9E0EA] last:border-0 ${isAlt ? "bg-[#F7F8FC]" : "bg-white"}`}>
      <div className="container">
        {/* Header — clear visual hierarchy */}
        <div className="flex items-start gap-4 mb-6 reveal">
          <span className="font-inter font-extrabold leading-none select-none hidden md:block shrink-0 text-[4rem]"
            style={{ color: "transparent", WebkitTextStroke: "2px rgba(23,37,84,0.08)", lineHeight: 1 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {/* 1. 業種名 — largest */}
            <h2 className="section-heading text-2xl lg:text-[1.875rem] text-[#172554] mb-2">{cat.name}</h2>
            {/* Target roles */}
            <div className="flex flex-wrap gap-1.5">
              {cat.targets.map((t) => (
                <span key={t} className="text-[0.8rem] bg-white border border-[#D9E0EA] text-[#64748B] px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. AIで変えられる仕事 — most prominent */}
        <div className="rounded-xl p-5 mb-4 reveal" style={{ background: "linear-gradient(135deg, rgba(23,37,84,0.04), rgba(163,55,123,0.04))", border: "1px solid rgba(163,55,123,0.15)" }}>
          <h3 className="text-[#172554] font-bold text-base mb-3">AIで変えられる仕事</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cat.aiUses.map((u) => (
              <div key={u} className="flex items-start gap-2 text-[0.9rem] text-[#111827] font-medium">
                <ChevronRight size={13} className="text-[#A3377B] shrink-0 mt-0.5" />{u}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* 3. 研修で行うこと */}
          <div className="rounded-xl p-5 bg-white border border-[#D9E0EA] reveal">
            <h3 className="text-[#64748B] font-bold text-[0.75rem] uppercase tracking-wider mb-3">研修で行うこと（標準12時間以上）</h3>
            <ol className="space-y-1.5">
              {cat.curriculum.map((c, i) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-[#111827]">
                  <span className="font-bold font-inter text-[#A3377B] shrink-0 text-[0.8rem] mt-0.5">{String(i + 1).padStart(2, "0")}</span>{c}
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-4">
            {/* 4. 成果物 */}
            <div className="rounded-xl p-5 bg-white border border-[#D9E0EA] reveal">
              <h3 className="text-[#64748B] font-bold text-[0.75rem] uppercase tracking-wider mb-3">主な成果物</h3>
              <ul className="space-y-1">
                {cat.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-[0.9rem] text-[#111827] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#172554] shrink-0" />{d}
                  </li>
                ))}
              </ul>
            </div>
            {/* Challenges — lower priority */}
            <div className="rounded-xl p-5 bg-white border border-[#D9E0EA] reveal">
              <h3 className="text-[#64748B] font-bold text-[0.75rem] uppercase tracking-wider mb-3">業界でよくある課題</h3>
              <ul className="space-y-1">
                {cat.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[0.8rem] text-[#64748B]">
                    <span className="text-[#D9E0EA] mt-1">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Before / After */}
        <div className="rounded-xl overflow-hidden border border-[#D9E0EA] reveal">
          <div className="grid grid-cols-2">
            <div className="p-4 bg-[#F7F8FC]">
              <div className="text-[#64748B] text-[0.7rem] font-bold uppercase tracking-wider mb-1.5">Before</div>
              <p className="text-[#64748B] text-[0.875rem] leading-relaxed">{cat.before}</p>
            </div>
            <div className="p-4" style={{ background: "linear-gradient(135deg, rgba(163,55,123,0.08), rgba(118,42,98,0.05))" }}>
              <div className="text-[#A3377B] text-[0.7rem] font-bold uppercase tracking-wider mb-1.5">After</div>
              <p className="text-[#111827] text-[0.9rem] font-semibold leading-relaxed">{cat.after}</p>
            </div>
          </div>
        </div>

        {/* Small text link CTA */}
        <div className="mt-4 reveal">
          <a href={`${url("/")}#consultation`} onClick={(e) => { e.preventDefault(); window.location.href = `${url("/")}#consultation`; }}
            className="inline-flex items-center gap-1.5 text-[#A3377B] text-sm font-semibold hover:underline">
            この業種について相談する <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function DarkBreak({ message }: { message: string }) {
  return (
    <div className="py-8 reveal" style={{ background: "linear-gradient(135deg, #172554, #243B72)" }}>
      <div className="container text-center">
        <p className="section-heading text-lg lg:text-xl text-white">{message}</p>
      </div>
    </div>
  );
}

export default function IndustryCurriculum() {
  useReveal();
  const [activeTab, setActiveTab] = useState(industryCategories[0].id);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Handle initial hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const found = industryCategories.find((c) => c.id === hash);
      if (found) {
        setActiveTab(hash);
        // Wait for layout to settle (images, etc.)
        // Wait for layout to settle — 600ms for reliable scroll after page load
        const timer = setTimeout(() => scrollToSection(hash), 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Scroll Spy — update active tab based on current scroll position
  useEffect(() => {
    const handleScroll = () => {
      const viewportH = window.innerHeight;
      const threshold = viewportH * 0.30; // 30% from top
      let current = industryCategories[0].id;
      for (const cat of industryCategories) {
        const el = document.getElementById(cat.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          current = cat.id;
        }
      }
      setActiveTab((prev) => {
        if (prev !== current) {
          // Auto-scroll the tab bar to show active tab
          const tabBar = tabBarRef.current;
          if (tabBar) {
            const activeBtn = tabBar.querySelector(`[data-id="${current}"]`) as HTMLElement;
            if (activeBtn) {
              const barRect = tabBar.getBoundingClientRect();
              const btnRect = activeBtn.getBoundingClientRect();
              const scrollLeft = tabBar.scrollLeft + (btnRect.left - barRect.left) - barRect.width / 2 + btnRect.width / 2;
              tabBar.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
          }
          // Update URL hash
          window.history.replaceState(null, "", `#${current}`);
        }
        return current;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      {/* Hero */}
      <section className="pt-28 pb-14" style={{ background: "linear-gradient(135deg, #0f1f4a 0%, #172554 60%, #1e2d6b 100%)" }}>
        <div className="container">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <Link href="/" className="hover:text-white/70 transition-colors">ホーム</Link>
            <ChevronRight size={12} />
            <span>業種別カリキュラム</span>
          </div>
          <h1 className="section-heading text-3xl lg:text-5xl text-white mb-4">あなたの業界では、AIをどう使える？</h1>
          <p className="text-white/60 max-w-xl">業界ごとの実際の業務から、AI活用の可能性を確認できます。</p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#D9E0EA] shadow-sm">
        <div ref={tabBarRef} className="container overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-0 min-w-max">
            {industryCategories.map((cat) => (
              <button key={cat.id}
                data-id={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  scrollToSection(cat.id);
                }}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === cat.id
                    ? "border-[#A3377B] text-[#A3377B]"
                    : "border-transparent text-[#64748B] hover:text-[#172554]"
                }`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {industryCategories.map((cat, i) => (
          <div key={cat.id}>
            <IndustrySection cat={cat} index={i} />
            {darkBreaks[i] && <DarkBreak message={darkBreaks[i]} />}
          </div>
        ))}
      </div>

      {/* Page-end CTA */}
      <div className="py-16 text-center" style={{ background: "linear-gradient(135deg, #172554, #1e2d6b)" }}>
        <div className="container">
          <h2 className="section-heading text-2xl lg:text-3xl text-white mb-4">御社の業種に合ったカリキュラムを、一緒に設計します。</h2>
          <a href={`${url("/")}#consultation`} onClick={(e) => { e.preventDefault(); window.location.href = `${url("/")}#consultation`; }} className="btn-primary inline-flex mt-2">
            無料でカリキュラム相談する <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
