/**
 * Home — 生成AIリスキリング研修 総合LP v5
 * v5: 「読むLP」→「見て理解するLP」全面リニューアル
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronDown, Check, ArrowRight } from "lucide-react";
import {
  IllustTime, IllustInhouse, IllustCheck, IllustStandard, IllustSales, IllustGrowth,
  IllustPainTime, IllustPainDepend, IllustPainOutsource,
  IllustBeforeSales, IllustAfterSales,
  IllustStep,
  IllustDeliverable,
} from "@/components/Illustrations";
import {
  OutcomesSlider,
  ExamplesSection,
  PainSection,
  ApproachSection,
  IndustrySlider,
  JobTabSection,
  DeliverablesSection,
  OverviewSection,
  RegulationSection,
} from "@/components/HomeSections";
import { asset, url } from "@/lib/paths";

// ── Scroll reveal ────────────────────────────────────────────────────────────
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
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── Counter animation ────────────────────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 1400;
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * to).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ── Hero Workflow Visual ──────────────────────────────────────────────────────
// Enterprise-grade workflow visualization: Input → AI Processing → Output
// No AI brains, no neon, no robots. Just clean work cards connected by data flow.
const workflowItems = [
  { dept: "法人営業", input: "顧客情報・課題", output: "提案書・企画書" },
  { dept: "広報・PR", input: "情報・トピック", output: "プレスリリース" },
  { dept: "製造", input: "手順・品質基準", output: "マニュアル・確認表" },
  { dept: "経理", input: "数値・帳票", output: "集計レポート" },
  { dept: "旅行", input: "料金・行程情報", output: "企画書・販促資料" },
  { dept: "人事", input: "採用・育成情報", output: "求人票・研修資料" },
];

function HeroWorkflowVisual({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <div className="relative hidden lg:block h-[520px]"
      style={{ transform: `translate(${mouse.x * -4}px, ${mouse.y * -4}px)`, transition: "transform 0.9s cubic-bezier(0.23,1,0.32,1)" }}>
      {/* Background grid layer */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(23,37,84,0.6) 0%, rgba(36,59,114,0.4) 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* Center AI processing node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ transform: `translate(calc(-50% + ${mouse.x * -6}px), calc(-50% + ${mouse.y * -6}px))`, transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}>
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-[#A3377B]/30 animate-spin" style={{ animationDuration: "12s" }} />
          <div className="absolute inset-2 rounded-full border border-[#A3377B]/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
          {/* Core */}
          <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #172554, #243B72)", border: "1px solid rgba(163,55,123,0.4)", boxShadow: "0 0 24px rgba(163,55,123,0.15)" }}>
            <div className="text-white font-bold text-xs tracking-wider">AI</div>
            <div className="text-white/40 text-[9px] mt-0.5">PROCESS</div>
          </div>
        </div>
      </div>

      {/* Work cards — 6 cards positioned around center */}
      {workflowItems.map((item, i) => {
        // Position cards in 2 columns (left: input, right: output) × 3 rows
        const isLeft = i % 2 === 0;
        const row = Math.floor(i / 2);
        const topPct = 12 + row * 32;
        const leftPct = isLeft ? 2 : 60;
        const cardDelay = `${i * 80}ms`;
        return (
          <div key={item.dept}
            className="absolute z-10"
            style={{
              top: `${topPct}%`, left: `${leftPct}%`,
              transform: `translate(${mouse.x * (isLeft ? -10 : 10)}px, ${mouse.y * -8}px)`,
              transition: `transform 0.5s cubic-bezier(0.23,1,0.32,1) ${cardDelay}`,
            }}>
            <div className="rounded-xl p-3 w-[148px]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              {/* Dept label */}
              <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider mb-1.5">{item.dept}</div>
              {/* Input row */}
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                <span className="text-white/60 text-[10px] leading-tight">{isLeft ? item.input : item.output}</span>
              </div>
              {/* Arrow + AI indicator */}
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex-1 h-px" style={{ background: isLeft ? "linear-gradient(90deg, rgba(163,55,123,0.5), rgba(163,55,123,0.1))" : "linear-gradient(90deg, rgba(163,55,123,0.1), rgba(163,55,123,0.5))" }} />
                <div className="text-[#A3377B] text-[9px] font-bold">{isLeft ? "→" : "✓"}</div>
              </div>
              {/* Output row */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isLeft ? "rgba(163,55,123,0.4)" : "#A3377B" }} />
                <span className={`text-[10px] leading-tight ${isLeft ? "text-white/40" : "text-white/80 font-medium"}`}>{isLeft ? "→ AI処理" : item.output}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Connection lines from cards to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 480 520" preserveAspectRatio="none">
        {/* Left column connections */}
        <line x1="148" y1="82" x2="240" y2="260" stroke="rgba(163,55,123,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="148" y1="248" x2="240" y2="260" stroke="rgba(163,55,123,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="148" y1="414" x2="240" y2="260" stroke="rgba(163,55,123,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Right column connections */}
        <line x1="332" y1="82" x2="240" y2="260" stroke="rgba(163,55,123,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="332" y1="248" x2="240" y2="260" stroke="rgba(163,55,123,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="332" y1="414" x2="240" y2="260" stroke="rgba(163,55,123,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Bottom stat strip */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex gap-2">
        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-white/40 text-[9px]">累計受講者数</div>
          <div className="text-white font-bold text-sm font-inter">15,000<span className="text-[10px] font-normal text-white/50">名以上</span></div>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-white/40 text-[9px]">受講者満足度</div>
          <div className="font-bold text-sm font-inter" style={{ color: "#e879b8" }}>98<span className="text-[10px] font-normal text-white/50">%</span></div>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-white/40 text-[9px]">対応業種</div>
          <div className="text-white font-bold text-sm font-inter">10<span className="text-[10px] font-normal text-white/50">業種</span></div>
        </div>
      </div>
    </div>
  );
}

// ── 3D tilt card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  };
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: style?.transition ?? "transform 0.3s cubic-bezier(0.23,1,0.32,1)", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ── FAQ item ─────────────────────────────────────────────────────────────────
const faqs = [
  { q: "AIの知識がない社員でも受講できますか？", a: "はい。生成AIの利用経験を前提とせず、実際の業務を題材に学ぶため、AI未経験の方でも安心して受講いただけます。" },
  { q: "研修の内容は自社の業種・職種に合わせてもらえますか？", a: "はい。無料カリキュラム相談で現状業務をヒアリングし、受講者の職種・業種・実際の担当業務から逆算したカリキュラムをご提案します。" },
  { q: "最低何名から受講できますか？", a: "5名以上から受講いただけます。人数・業種・職種に応じてカリキュラムを調整しますので、まずはご相談ください。" },
  { q: "オンラインでも受講できますか？", a: "対面・リアルタイムオンライン・ハイブリッドに対応しています。全国対応（要調整）です。" },
  { q: "助成金は必ず受給できますか？", a: "助成金の支給可否は、企業・受講者・訓練内容等の要件および労働局の審査によります。支給を保証するものではありませんが、活用に向けた情報提供・サポートを行います。" },
  { q: "研修後のフォローはありますか？", a: "研修後も個別相談に対応しています。また、AI活用コンサルティングやAIシステム開発など、仕組みづくりまで支援するサービスもご用意しています（研修とは別サービスです）。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D9E0EA] last:border-0">
      <button
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-[#111827] group-hover:text-[#A3377B] transition-colors leading-relaxed">{q}</span>
        <ChevronDown size={20} className={`shrink-0 mt-0.5 text-[#A3377B] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-[#64748B] leading-relaxed text-sm">{a}</div>}
    </div>
  );
}

// ── Industry card data ────────────────────────────────────────────────────────
const industryCards = [
  { name: "旅行・観光", id: "travel", items: ["料金計算", "行程確認", "旅行企画", "販促制作"] },
  { name: "小売・EC", id: "retail-ec", items: ["商品説明", "販促コンテンツ", "顧客対応", "販売分析"] },
  { name: "製造", id: "manufacturing", items: ["生産管理", "品質確認", "作業標準", "技能継承"] },
  { name: "印刷・紙製品", id: "printing", items: ["仕様整理", "見積", "校正", "生産管理"] },
  { name: "建設・設備工事", id: "construction", items: ["現場書類", "報告書", "安全管理", "提案資料"] },
  { name: "不動産", id: "real-estate", items: ["物件説明", "提案資料", "顧客対応", "契約確認"] },
  { name: "物流・運輸", id: "logistics", items: ["運行報告", "問い合わせ対応", "業務マニュアル", "配車整理"] },
  { name: "介護・福祉", id: "care-welfare", items: ["記録・申し送り", "研修資料", "業務マニュアル", "報告書"] },
  { name: "宿泊・飲食", id: "hospitality-food", items: ["販促コンテンツ", "予約対応", "接客マニュアル", "メニュー説明"] },
  { name: "イベント・メディア", id: "event-media", items: ["企画・台本", "広報資料", "コンテンツ制作", "進行管理"] },
];

const jobCards = [
  { name: "法人営業・マーケティング", id: "sales-marketing", items: ["顧客分析", "提案書作成", "販促企画", "フォローアップ"] },
  { name: "広報・PR", id: "pr", items: ["プレスリリース", "SNS投稿", "取材準備", "情報発信"] },
  { name: "クリエイティブ", id: "creative", items: ["企画・構成", "コピー量産", "画像生成活用", "制作指示書"] },
  { name: "人事・採用", id: "hr", items: ["求人票作成", "研修資料", "オンボーディング", "評価文書"] },
  { name: "総務・契約管理", id: "general-affairs-contract", items: ["契約確認", "差分チェック", "社内文書", "期限管理"] },
  { name: "経理・財務", id: "accounting-finance", items: ["数値確認", "集計レポート", "予実管理", "異常値整理"] },
  { name: "カスタマーサポート", id: "customer-support", items: ["回答案生成", "FAQ整備", "VOC分析", "ナレッジ整理"] },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();

  // Mouse parallax for hero (desktop only)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  useEffect(() => {
    if (isMobile) return;
    const handle = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [isMobile]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [formState, setFormState] = useState<"idle" | "submitted">("idle");
  const [formData, setFormData] = useState({ company: "", name: "", email: "", phone: "", training: "", message: "" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormState("submitted"); };

  // SP Sticky CTA visibility
  const [showSpCta, setShowSpCta] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const consultation = document.getElementById("consultation");
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      const pastHero = heroBottom < 0;
      // Hide near consultation form
      let nearForm = false;
      if (consultation) {
        const formRect = consultation.getBoundingClientRect();
        nearForm = formRect.top < window.innerHeight * 1.2;
      }
      setShowSpCta(pastHero && !nearForm);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <GlobalNav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "#0f1f4a" }}
      >
        {/* FV Image — right side, full height, blends with dark navy bg */}
        {/* PC: absolute right half; SP: below text */}
        <div
          className="absolute inset-y-0 right-0 hidden lg:block"
          style={{
            width: "58%",
            transform: `translate(${mouse.x * 3}px, ${mouse.y * 2}px)`,
            transition: "transform 1.2s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          {/* Left-side fade to merge with dark navy */}
          <div className="absolute inset-y-0 left-0 w-48 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0f1f4a 0%, transparent 100%)" }} />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top, #0f1f4a 0%, transparent 100%)" }} />
          <picture>
            <source srcSet={asset("/images/fv_hero_image.webp")} type="image/webp" />
            <img
              src={asset("/images/fv_hero_image.png")}
              alt="複数業種の仕事がデジタルにつながるビジュアル"
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center center" }}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width="1672"
              height="941"
            />
          </picture>
        </div>

        {/* Content */}
        <div className="container relative z-20 pt-24 pb-16 lg:pt-32">
          <div className="lg:max-w-[52%]">
            {/* Left text block */}
            <div className="subsidy-badge mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e879b8] inline-block" />
              人材開発支援助成金 活用可能
            </div>
            <p className="text-white/50 text-sm font-medium mb-3 tracking-wide">業種・職種別 生成AIリスキリング研修</p>
            <h1 className="section-heading text-white text-4xl lg:text-5xl xl:text-[3.25rem] mb-5 leading-tight">
              あなたの業界にAIを入れると、<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>
                仕事はここまで変わる。
              </span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-2 max-w-lg">
              営業、マーケティング、広報、人事、経理、製造、旅行など、<br className="hidden lg:block" />
              実際の仕事を題材にAI活用を身につける実践型研修。<br className="hidden lg:block" />
              業務時間の短縮、外注業務の内製化、確認精度の向上、<br className="hidden lg:block" />
              提案力・販売力の強化まで、仕事の成果につなげます。
            </p>
            <p className="text-white/40 text-xs mb-7">※AI活用による改善範囲や効果は、対象業務・運用方法・導入環境等によって異なります。</p>
            <div className="flex flex-wrap gap-3 mb-3">
              <a href="#consultation" onClick={(e) => handleAnchorClick(e, "consultation")} className="btn-primary">
                無料でカリキュラム相談する <ArrowRight size={16} />
              </a>
              <a href="#industry" onClick={(e) => handleAnchorClick(e, "industry")} className="btn-outline-navy">
                あなたの業種を見る <ChevronDown size={16} />
              </a>
            </div>
            <a href="#job" onClick={(e) => handleAnchorClick(e, "job")} className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors">
              <ChevronRight size={14} /> 職種から探す
            </a>
          </div>

        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs z-20">
          <span>SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── PROOF BAR ────────────────────────────────────────────────── */}
      <section id="proof" className="bg-[#243B72] py-8">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "累計受講者数", value: 15000, suffix: "名以上" },
              { label: "受講者満足度", value: 98, suffix: "%" },
              { label: "助成金活用件数", value: 50, suffix: "件以上" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1">
                <div className="text-2xl lg:text-3xl font-bold font-inter text-white">
                  <CountUp to={m.value} suffix={m.suffix} />
                </div>
                <div className="text-white/60 text-xs lg:text-sm">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ─────────────────────────────────────────────────── */}
      {/* ── OUTCOMES — 横スライド + イラスト ──────────────────────────── */}
      <OutcomesSlider />

      {/* ── BEFORE→AI→AFTER ──────────────────────────────────────────── */}
      {/* ── EXAMPLES — メイン大型枠 + サムネイル切替 ─────────────────── */}
      <ExamplesSection />

      {/* ── PAIN POINTS (redesigned) ──────────────────────────────────── */}
      {/* ── PAIN — 大型イラストカード3枚 ────────────────────────────── */}
      <PainSection />

      {/* ── APPROACH ─────────────────────────────────────────────────── */}
      {/* ── APPROACH — Sticky Storytelling 5STEP ────────────────────── */}
      <ApproachSection />

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="section-light py-20 lg:py-28">
        <div className="container">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-4 reveal">
            仕事で成果を出すための、3つの設計。
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { num: "01", title: "業種・職種別", body: "全員一律ではなく、受講者の実際の職務に合わせて学ぶ。" },
              { num: "02", title: "アウトプット中心", body: "説明を聞いて終わらず、仕事で使う成果物まで作る。" },
              { num: "03", title: "自走できる", body: "研修後も社員自身がAIを使い、改善を続けられる状態をつくる。" },
            ].map((f, i) => (
              <TiltCard key={f.title} className="relative overflow-hidden rounded-xl p-8 reveal" style={{ background: "linear-gradient(135deg, #172554, #243B72)", transitionDelay: `${i * 100}ms` } as React.CSSProperties}>
                <div className="absolute top-4 right-4 font-inter font-extrabold text-7xl leading-none select-none" style={{ color: "rgba(255,255,255,0.04)" }}>{f.num}</div>
                <div className="relative z-10">
                  <div className="w-10 h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg, #A3377B, #e879b8)" }} />
                  <h3 className="font-bold text-white text-xl mb-3">{f.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{f.body}</p>
                </div>
              </TiltCard>
            ))}
          </div>
          <p className="text-[#64748B] text-xs mt-6 reveal">※研修後のAI活用状況は、受講者の職務・習熟度・社内環境等によって異なります。</p>
        </div>
      </section>

      {/* ── INDUSTRY ─────────────────────────────────────────────────── */}
      {/* ── INDUSTRY — 横スライドカード ──────────────────────────────── */}
      <IndustrySlider industryCards={industryCards} />

      {/* ── JOB ──────────────────────────────────────────────────────── */}
      {/* ── JOB — タブ切替 + 大型カード ─────────────────────────────── */}
      <JobTabSection jobCards={jobCards} />

      {/* ── DELIVERABLES ─────────────────────────────────────────────── */}
      {/* ── DELIVERABLES — コラージュビジュアル ──────────────────────── */}
      <DeliverablesSection />

      {/* ── TRAINING OVERVIEW ────────────────────────────────────────── */}
      {/* ── TRAINING OVERVIEW — スペック数値大型表示 ─────────────────── */}
      <OverviewSection />

      {/* ── AI TRAINING APPROACH (制度改正) ──────────────────────────── */}
      {/* ── REGULATION — 左右比較図解 ────────────────────────────────── */}
      <RegulationSection />

      {/* ── SUBSIDY TEASER ───────────────────────────────────────────── */}
      <section id="subsidy" className="section-navy py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-heading text-3xl lg:text-4xl text-white mb-6 reveal">
              助成金を活用して、<br />AI人材育成の負担を抑える。
            </h2>
            <div className="glass-card p-8 mb-4 reveal">
              <div className="text-white/60 text-sm mb-4">5名受講の場合の一例</div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><div className="text-white/50 text-xs mb-1">研修費用</div><div className="text-white font-bold text-xl font-inter">200万円</div></div>
                <div><div className="text-white/50 text-xs mb-1">助成金活用例</div><div className="text-[#e879b8] font-bold text-xl font-inter">▲150万円</div></div>
                <div><div className="text-white/50 text-xs mb-1">実質負担例</div><div className="text-white font-bold text-2xl font-inter">50万円</div></div>
              </div>
              <div className="text-[#e879b8] font-bold text-sm">1名あたり実質10万円</div>
            </div>
            <p className="text-white/60 text-xs mb-1 reveal">※所定の要件を満たし、想定する助成額が認められた場合の一例です。助成金の支給・助成額を保証するものではありません。</p>
            <p className="text-white/50 text-xs mb-6 reveal">標準研修費：1名40万円 ※研修内容・時間・人数等により異なる場合があります。</p>
            <a href={url("/subsidy")} onClick={(e) => { e.preventDefault(); window.history.scrollRestoration = "manual" as ScrollRestoration; window.location.href = url("/subsidy"); }} className="btn-primary inline-flex reveal">
              助成金活用ガイドを見る <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── POST TRAINING ─────────────────────────────────────────────── */}
      <section id="after-support" className="section-light py-20 lg:py-28">
        <div className="container">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-4 reveal text-center">
            人を育てる。<br />その先の仕組みまでつくる。
          </h2>
          <p className="text-[#64748B] text-center mb-10 reveal text-sm">以下は研修とは別のサービスです。研修後の課題に応じてご提案します。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { title: "AI活用コンサルティング", desc: "現場に入りながらAI活用・業務改善・定着を支援。FDE派遣に近い形で、実務に即した改善を推進します。" },
              { title: "AIシステム開発", desc: "研修で発見した課題のうち、仕組み化すべき業務をAI・システムとして実装します。" },
            ].map((s, i) => (
              <TiltCard key={s.title} className="rounded-xl p-7 reveal" style={{ background: "linear-gradient(135deg, #172554, #243B72)", transitionDelay: `${i * 120}ms` } as React.CSSProperties}>
                <div className="w-8 h-1 rounded-full mb-5" style={{ background: "linear-gradient(90deg, #A3377B, #e879b8)" }} />
                <h3 className="font-bold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOW (6 STEPS — PC横型 / SP縦型) ────────────────────────── */}
      <section id="flow" className="section-white py-20 lg:py-28">
        <div className="container">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-14 reveal text-center">導入までの流れ</h2>
          {/* PC: horizontal */}
          <div className="hidden lg:flex items-start gap-0 reveal">
            {[
              { n: "01", label: "無料カリキュラム相談" },
              { n: "02", label: "業務ヒアリング・簡易棚卸し" },
              { n: "03", label: "受講者・カリキュラム設計" },
              { n: "04", label: "発注・必要手続き" },
              { n: "05", label: "研修・成果物作成" },
              { n: "06", label: "実務活用" },
            ].map((step, i) => (
              <div key={step.n} className="flex-1 flex flex-col items-center text-center relative">
                {i < 5 && <div className="absolute top-5 left-1/2 w-full h-px bg-[#D9E0EA]" />}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-inter mb-3 ${i === 0 ? "bg-[#A3377B] text-white" : "bg-white border-2 border-[#D9E0EA] text-[#64748B]"}`}>{i + 1}</div>
                <div className={`text-xs font-semibold leading-tight ${i === 0 ? "text-[#A3377B]" : "text-[#111827]"}`}>{step.label}</div>
              </div>
            ))}
          </div>
          {/* SP: vertical */}
          <div className="lg:hidden max-w-sm mx-auto">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-[#D9E0EA]" />
              {[
                { n: "01", label: "無料カリキュラム相談" },
                { n: "02", label: "業務ヒアリング・簡易棚卸し" },
                { n: "03", label: "受講者・カリキュラム設計" },
                { n: "04", label: "発注・必要手続き" },
                { n: "05", label: "研修・成果物作成" },
                { n: "06", label: "実務活用" },
              ].map((step, i) => (
                <div key={step.n} className="relative flex items-center gap-5 pb-7 last:pb-0 reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-inter shrink-0 ${i === 0 ? "bg-[#A3377B] text-white" : "bg-white border-2 border-[#D9E0EA] text-[#64748B]"}`}>{i + 1}</div>
                  <span className={`font-semibold text-sm ${i === 0 ? "text-[#A3377B]" : "text-[#111827]"}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="section-light py-20 lg:py-28">
        <div className="container">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-12 reveal text-center">よくある質問</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#D9E0EA] p-6 lg:p-8 reveal">
            {faqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CONSULTATION ─────────────────────────────────────────────── */}
      <section id="consultation" className="section-dark py-20 lg:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="section-heading text-3xl lg:text-4xl text-white mb-4">
                御社には、<br />どのAI活用が必要なのか。<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>まずは一緒に整理します。</span>
              </h2>
              <p className="text-white/60">無料カリキュラム相談</p>
            </div>
            {formState === "idle" ? (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5 reveal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="company">会社名 <span className="text-[#e879b8]">*</span></label>
                    <input id="company" type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm" placeholder="株式会社〇〇" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="name">氏名 <span className="text-[#e879b8]">*</span></label>
                    <input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm" placeholder="山田 太郎" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="email">メールアドレス <span className="text-[#e879b8]">*</span></label>
                    <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm" placeholder="taro@example.com" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="phone">電話番号 <span className="text-[#e879b8]">*</span></label>
                    <input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm" placeholder="03-0000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="training">検討している研修 <span className="text-white/30 text-xs">（任意）</span></label>
                  <input id="training" type="text" value={formData.training} onChange={(e) => setFormData({ ...formData, training: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm" placeholder="例：営業チーム向け、製造部門向けなど" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5" htmlFor="message">相談内容 <span className="text-white/30 text-xs">（任意）</span></label>
                  <textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#A3377B] transition-colors text-sm resize-none" placeholder="現在の課題や相談したいことをご記入ください" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-base py-4">
                  無料相談を申し込む <ArrowRight size={18} />
                </button>
                <p className="text-white/30 text-xs text-center">※ 本フォームはプロトタイプ用の仮実装です。本番移植時に正式フォームへ差し替えます。</p>
              </form>
            ) : (
              <div className="glass-card p-10 text-center reveal">
                <div className="w-16 h-16 rounded-full bg-[#A3377B]/20 flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-[#e879b8]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">ご相談を受け付けました</h3>
                <p className="text-white/60 text-sm mb-8">担当者よりご連絡いたします。</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">Googleカレンダーで日時を予約する</a>
                  <button onClick={() => setFormState("idle")} className="btn-outline-navy justify-center">営業担当からの連絡を待つ</button>
                </div>
                <p className="text-white/30 text-xs mt-4">※ Googleカレンダー予約URLは本番移植時に設定します。</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SP Sticky CTA — mobile only, shown after FV scroll, hidden near consultation form */}
      <div className={`sp-sticky-cta ${showSpCta ? "" : "hidden-cta"}`}>
        <a
          href="#consultation"
          onClick={(e) => handleAnchorClick(e, "consultation")}
          className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-lg"
          style={{ background: "linear-gradient(135deg, #A3377B, #762A62)" }}
        >
          無料でカリキュラム相談する <ArrowRight size={14} />
        </a>
      </div>

      <Footer />
    </div>
  );
}
