/**
 * JobCurriculum — 職種別カリキュラムページ v3
 * 修正: アンカーID修正・Scroll Spy・sticky offset・URLハッシュ更新・Dark Break高さ調整
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight } from "lucide-react";
import { url } from "@/lib/paths";

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

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

const darkBreaks: Record<number, string> = {
  2: "AIで変えられるのは、資料作成だけではない。",
  5: "人が判断し、AIが仕事を加速させる。",
};

// IDs match the spec exactly
const jobCategories = [
  {
    id: "sales-marketing",
    name: "法人営業・マーケティング",
    duties: "顧客開拓、提案書作成、商談対応、マーケティング施策立案・実行",
    challenges: ["提案書作成に時間がかかる", "顧客ごとの情報整理が属人化している", "施策の企画・資料化に工数がかかる"],
    aiUses: ["顧客課題の整理・提案構成の初稿生成", "競合・市場情報の要約", "マーケティング施策の企画書・コピー生成"],
    purpose: "AIを使って提案の質と速度を高め、顧客対応・売上創出に集中できる状態をつくる",
    curriculum: ["業務棚卸しとAI活用候補の整理", "顧客情報・課題整理のAI活用", "提案書・企画書の初稿生成", "競合・市場調査の効率化", "フォローアップ文書の自動化"],
    skills: ["プロンプト設計", "情報整理・要約", "文書生成・編集", "データ分析補助"],
    deliverables: ["営業提案書（初稿）", "顧客課題整理シート", "マーケティング企画書"],
    before: "顧客情報を整理し、提案書をゼロから作る",
    after: "AIで課題整理・構成・初稿をつくり、提案の質と速度を高める",
  },
  {
    id: "pr",
    name: "広報・PR",
    duties: "プレスリリース作成、メディア対応、SNS運用、社内広報",
    challenges: ["プレスリリースの執筆に時間がかかる", "SNS投稿のネタ出しが大変", "取材準備・資料整理が属人化"],
    aiUses: ["プレスリリース・記事の初稿生成", "SNS投稿案の一括生成", "取材準備資料・Q&Aの整理"],
    purpose: "情報発信の量と質を高め、広報活動の生産性を向上させる",
    curriculum: ["広報業務の棚卸しとAI活用候補", "プレスリリース・記事の生成と編集", "SNSコンテンツの企画・生成", "取材準備・メディアリスト整理", "社内広報資料の効率化"],
    skills: ["文章生成・編集", "コンテンツ企画", "情報整理・要約", "トーン調整"],
    deliverables: ["プレスリリース（初稿）", "SNS投稿カレンダー", "取材準備シート"],
    before: "プレスリリースや記事をゼロから書く",
    after: "AIで構成・初稿を生成し、編集・確認に集中する",
  },
  {
    id: "creative",
    name: "クリエイティブ",
    duties: "デザイン・映像・コピー・広告制作、企画立案",
    challenges: ["企画・構成のアイデア出しに時間がかかる", "コピーの量産が大変", "制作物の品質チェックが属人化"],
    aiUses: ["企画・コンセプトのアイデア生成", "コピー・キャッチフレーズの量産", "制作指示書・仕様書の整理"],
    purpose: "クリエイティブの初速を上げ、制作の質と量を両立させる",
    curriculum: ["クリエイティブ業務の棚卸し", "企画・コンセプト生成", "コピー・テキスト量産", "画像生成AIの活用", "制作物の品質確認・改善"],
    skills: ["アイデア生成", "コピーライティング", "画像生成AI活用", "制作指示書作成"],
    deliverables: ["企画書・コンセプトシート", "コピー案リスト", "制作指示書"],
    before: "企画・コピーをゼロから考える",
    after: "AIでアイデア・初稿を生成し、クリエイティブ判断に集中する",
  },
  {
    id: "hr",
    name: "人事・採用",
    duties: "採用活動、研修企画・運営、評価制度運用、オンボーディング",
    challenges: ["求人票・面接資料の作成に時間がかかる", "研修資料の制作が属人化", "オンボーディング資料の整備が追いつかない"],
    aiUses: ["求人票・採用資料の生成", "研修コンテンツ・資料の作成", "オンボーディングマニュアルの整備"],
    purpose: "採用・育成の資料制作を効率化し、人材育成の質を高める",
    curriculum: ["人事業務の棚卸しとAI活用候補", "求人票・採用資料の生成", "研修コンテンツの設計と制作", "オンボーディング資料の整備", "評価・フィードバック文書の効率化"],
    skills: ["文書生成・編集", "コンテンツ設計", "情報整理・構造化", "マニュアル作成"],
    deliverables: ["求人票（初稿）", "研修資料", "オンボーディングマニュアル"],
    before: "採用・研修資料をゼロから作る",
    after: "AIで構成・初稿を生成し、内容の精査・改善に集中する",
  },
  {
    id: "general-affairs-contract",
    name: "総務・契約管理",
    duties: "文書管理、規程・契約書の作成・確認、社内手続き対応",
    challenges: ["契約書・規程の確認・差分チェックに時間がかかる", "社内文書の作成・更新が属人化", "期限管理・確認業務の漏れが発生しやすい"],
    aiUses: ["契約書・規程の差分・確認候補の整理", "社内文書・通知の生成", "期限・確認リストの整理"],
    purpose: "確認・管理業務の精度を高め、重要な判断に集中できる状態をつくる",
    curriculum: ["総務業務の棚卸しとAI活用候補", "文書・規程の確認・差分整理", "社内文書・通知の生成", "期限・確認業務の管理", "契約書確認の効率化"],
    skills: ["文書確認・差分整理", "文書生成・編集", "リスト・チェックリスト作成", "情報整理"],
    deliverables: ["契約確認表", "社内通知文（初稿）", "期限管理リスト"],
    before: "契約書・規程を目視で確認・差分チェック",
    after: "AIで確認候補・差分を整理し、人が最終判断に集中",
  },
  {
    id: "accounting-finance",
    name: "経理・財務",
    duties: "請求・入金管理、集計・レポート作成、予実管理、数値確認",
    challenges: ["大量の数値・帳票の確認に時間がかかる", "レポート・集計資料の作成が属人化", "異常値・確認候補の発見が大変"],
    aiUses: ["数値・帳票の確認候補・異常値の整理", "集計・レポートの初稿生成", "予実管理資料の効率化"],
    purpose: "確認・集計業務の精度と速度を高め、財務判断に集中できる状態をつくる",
    curriculum: ["経理業務の棚卸しとAI活用候補", "数値・帳票の確認候補整理", "集計・レポートの生成", "予実管理の効率化", "異常値・確認業務の自動化"],
    skills: ["数値確認・整理", "レポート生成", "データ分析補助", "異常値検出補助"],
    deliverables: ["経理確認表", "集計レポート（初稿）", "予実管理シート"],
    before: "大量の数値・帳票を目視で確認",
    after: "AIで不整合・確認候補を整理し、人が最終確認に集中",
  },
  {
    id: "customer-support",
    name: "カスタマーサポート",
    duties: "問い合わせ対応、FAQ整備、VOC分析、ナレッジ管理",
    challenges: ["問い合わせ対応の回答作成に時間がかかる", "FAQの整備・更新が追いつかない", "VOC分析・ナレッジ整理が属人化"],
    aiUses: ["問い合わせの整理・回答案の生成", "FAQ・ナレッジベースの整備", "VOC分析・傾向整理"],
    purpose: "対応品質と速度を高め、顧客満足度向上と業務効率化を両立させる",
    curriculum: ["CS業務の棚卸しとAI活用候補", "問い合わせ整理・回答案生成", "FAQ・ナレッジ整備", "VOC分析・傾向整理", "対応品質の改善"],
    skills: ["回答文生成・編集", "FAQ設計", "VOC分析補助", "ナレッジ整理"],
    deliverables: ["FAQ（初稿）", "回答テンプレート集", "VOC分析レポート"],
    before: "問い合わせごとに回答をゼロから作る",
    after: "AIで回答案を生成し、確認・改善に集中する",
  },
];

function JobSection({ cat, index }: { cat: typeof jobCategories[0]; index: number }) {
  const isAlt = index % 2 === 1;
  return (
    <div id={cat.id} className={`py-12 lg:py-16 border-b border-[#D9E0EA] last:border-0 ${isAlt ? "bg-[#F7F8FC]" : "bg-white"}`}>
      <div className="container">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 reveal">
          <span className="font-inter font-extrabold leading-none select-none hidden md:block shrink-0 text-[4rem]"
            style={{ color: "transparent", WebkitTextStroke: "2px rgba(23,37,84,0.08)", lineHeight: 1 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h2 className="section-heading text-2xl lg:text-[1.875rem] text-[#172554] mb-1">{cat.name}</h2>
            <p className="text-[#64748B] text-[0.8rem]">{cat.duties}</p>
          </div>
        </div>

        {/* 2. AIで変えられる業務 — most prominent */}
        <div className="rounded-xl p-5 mb-4 reveal" style={{ background: "linear-gradient(135deg, rgba(23,37,84,0.04), rgba(163,55,123,0.04))", border: "1px solid rgba(163,55,123,0.15)" }}>
          <h3 className="text-[#172554] font-bold text-base mb-3">AIで変えられる業務</h3>
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
            {/* Challenges */}
            <div className="rounded-xl p-5 bg-white border border-[#D9E0EA] reveal">
              <h3 className="text-[#64748B] font-bold text-[0.75rem] uppercase tracking-wider mb-3">よくある課題</h3>
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
            この職種について相談する <ArrowRight size={14} />
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

export default function JobCurriculum() {
  useReveal();
  const [activeTab, setActiveTab] = useState(jobCategories[0].id);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Handle initial hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const found = jobCategories.find((c) => c.id === hash);
      if (found) {
        setActiveTab(hash);
        const timer = setTimeout(() => scrollToSection(hash), 400);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const viewportH = window.innerHeight;
      const threshold = viewportH * 0.30;
      let current = jobCategories[0].id;
      for (const cat of jobCategories) {
        const el = document.getElementById(cat.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          current = cat.id;
        }
      }
      setActiveTab((prev) => {
        if (prev !== current) {
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
            <span>職種別カリキュラム</span>
          </div>
          <h1 className="section-heading text-3xl lg:text-5xl text-white mb-4">職種から、AIで変えられる仕事を探す。</h1>
          <p className="text-white/60 max-w-xl">受講者の実際の職務から逆算したカリキュラムで、仕事の成果につなげます。</p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#D9E0EA] shadow-sm">
        <div ref={tabBarRef} className="container overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-0 min-w-max">
            {jobCategories.map((cat) => (
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
        {jobCategories.map((cat, i) => (
          <div key={cat.id}>
            <JobSection cat={cat} index={i} />
            {darkBreaks[i] && <DarkBreak message={darkBreaks[i]} />}
          </div>
        ))}
      </div>

      {/* Page-end CTA */}
      <div className="py-16 text-center" style={{ background: "linear-gradient(135deg, #172554, #1e2d6b)" }}>
        <div className="container">
          <h2 className="section-heading text-2xl lg:text-3xl text-white mb-4">御社の職種に合ったカリキュラムを、一緒に設計します。</h2>
          <a href={`${url("/")}#consultation`} onClick={(e) => { e.preventDefault(); window.location.href = `${url("/")}#consultation`; }} className="btn-primary inline-flex mt-2">
            無料でカリキュラム相談する <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
