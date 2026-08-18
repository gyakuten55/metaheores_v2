/**
 * HomeSections.tsx — Home.tsxの各セクションコンポーネント
 * v5: 「読むLP」→「見て理解するLP」全面リニューアル
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import {
  IllustDeliverable,
} from "@/components/Illustrations";
import { asset, url } from "@/lib/paths";

// ── 1. OUTCOMES — 横スライド + イラスト ──────────────────────────────────────
// ── SHARED HOOK: ドラッグ対応スライダー ──────────────────────────────────────
function useSlider(totalItems: number, visibleCount: number = 1) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const [swipeHintShown, setSwipeHintShown] = useState(true);

  const maxIndex = Math.max(0, totalItems - visibleCount);

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(idx, maxIndex));
    setCurrentIndex(clamped);
    const cards = track.querySelectorAll<HTMLElement>(".slider-card");
    if (cards[clamped]) {
      const cardLeft = cards[clamped].offsetLeft;
      track.scrollTo({ left: cardLeft - track.offsetLeft, behavior: "smooth" });
    }
  };

  // mousedown時点ではドラッグ状態にしない。これによりカード内リンクを通常クリックできる。
  const pointerDown = useRef(false);
  const wasDrag = useRef(false);
  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    pointerDown.current = true;
    wasDrag.current = false;
    dragStart.current = { x: e.pageX, scrollLeft: track.scrollLeft };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!pointerDown.current || !trackRef.current) return;
    const dx = e.pageX - dragStart.current.x;
    // 5px以上の移動をドラッグとして扱う。通常クリックではpointer-eventsを無効化しない。
    if (Math.abs(dx) > 5 && !wasDrag.current) {
      wasDrag.current = true;
      setIsDragging(true);
      trackRef.current.classList.add("is-dragging");
    }
    if (!wasDrag.current) return;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onMouseUp = () => {
    if (!pointerDown.current || !trackRef.current) return;
    pointerDown.current = false;
    if (!wasDrag.current) return;
    setIsDragging(false);
    trackRef.current.classList.remove("is-dragging");
    // Snap to nearest card
    const track = trackRef.current;
    const cards = track.querySelectorAll<HTMLElement>(".slider-card");
    let nearest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    scrollToIndex(nearest);
    setSwipeHintShown(false);
  };
  const onScroll = () => {
    const track = trackRef.current;
    if (!track || isDragging) return;
    const cards = track.querySelectorAll<HTMLElement>(".slider-card");
    let nearest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    setCurrentIndex(nearest);
    if (nearest > 0) setSwipeHintShown(false);
  };

  return {
    trackRef, currentIndex, maxIndex, isDragging, swipeHintShown,
    scrollToIndex,
    wasDrag,
    trackHandlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp, onScroll },
  };
}

// ── 1. OUTCOMES — 横スライド + イラスト ──────────────────────────────────────
export function OutcomesSlider() {
  const outcomeCards = [
    { img: asset("/images/outcome-time.png"), alt: "AI活用による業務時間削減のイメージ", tag: "TIME", title: "時間を取り戻す", body: "資料作成・情報整理・確認作業の時間を減らし、顧客対応や企画へ時間を戻す。" },
    { img: asset("/images/outcome-inhouse.png"), alt: "AI活用による業務内製化のイメージ", tag: "COST", title: "外注を内製化する", body: "文章・企画・資料・マニュアルなど、外部依存の制作工程を社内で回しやすくする。" },
    { img: asset("/images/outcome-accuracy.png"), alt: "AI活用によるミス・抜け漏れ削減のイメージ", tag: "QUALITY", title: "ミスと抜け漏れを減らす", body: "大量データや書類の確認候補をAIで整理し、人が重要な判断に集中できる状態へ。" },
    { img: asset("/images/outcome-standardize.png"), alt: "AI活用による属人業務標準化のイメージ", tag: "STANDARDIZE", title: "属人業務を標準化する", body: "熟練者の知識や業務手順を整理し、誰でも再現しやすい仕事の型へ。" },
    { img: asset("/images/outcome-sales.png"), alt: "AI活用による提案・販売力向上のイメージ", tag: "SALES", title: "提案・販売力を高める", body: "顧客理解・企画・提案・販促の初速を上げ、売上につながる仕事を強化する。" },
    { img: asset("/images/outcome-improve.png"), alt: "AI活用による社員自律改善のイメージ", tag: "GROWTH", title: "社員が自ら改善する", body: "研修後も社員自身がAIを使い、新しい改善方法を考えられる状態をつくる。" },
  ];
  const { trackRef, currentIndex, maxIndex, swipeHintShown, scrollToIndex, trackHandlers } = useSlider(outcomeCards.length, 3);

  return (
    <section id="outcomes" className="section-light py-20 lg:py-28 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-4">
            AIで、会社の仕事はここまで変えられる。
          </h2>
          <p className="text-[#64748B] leading-relaxed">
            AIを使うこと自体が目的ではありません。社員がAIを仕事に組み込み、成果を出せる状態をつくります。
          </p>
        </div>
      </div>
      {/* ── Slider: container内でArrow・カード・見出しを同一グリッドに揃える ── */}
      <div className="container">
        {/* Arrow + Track ラッパー: overflow-hidden でトラックのはみ出しをクリップ */}
        <div className="relative">
          {/* Left Arrow — 見出し左端と同じライン (container 左端) */}
          <button
            className="slider-arrow hidden lg:flex"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="前へ"
            style={{ left: "-1.25rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={18} />
          </button>
          {/* Right Arrow — コンテンツグリッド右端付近 */}
          <button
            className="slider-arrow hidden lg:flex"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex >= maxIndex}
            aria-label="次へ"
            style={{ right: "-1.25rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Track — overflow-x:auto でスクロール、左端は container に揃う */}
          <div
            ref={trackRef}
            className="slider-track"
            style={{ paddingLeft: 0, paddingRight: "2rem" }}
            {...trackHandlers}
          >
            {outcomeCards.map((card, i) => (
              <div
                key={card.title}
                className="slider-card snap-start shrink-0 bg-white border border-[#D9E0EA] rounded-2xl p-6 flex flex-col items-center text-center"
                style={{ width: "clamp(220px, 28vw, 280px)" }}
              >
                <div className="mb-4 flex items-center justify-center" style={{ width: 100, height: 100 }}>
                  <img src={card.img} alt={card.alt} loading="lazy"
                    style={{ width: 100, height: 100, objectFit: "contain", aspectRatio: "1/1" }} />
                </div>
                <div className="text-[#A3377B] text-[0.65rem] font-bold tracking-widest mb-1.5">{card.tag}</div>
                <h3 className="font-bold text-[#172554] text-base mb-2 leading-tight">{card.title}</h3>
                <p className="text-[#64748B] text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
            <div className="shrink-0 w-4" />
          </div>

          {/* SP swipe hint */}
          {swipeHintShown && (
            <div className="lg:hidden absolute bottom-14 right-0 flex items-center gap-1 text-[#A3377B] text-[0.65rem] font-semibold opacity-70 pointer-events-none">
              横にスライド <ArrowRight size={10} />
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4 mb-1">
          {outcomeCards.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`slider-dot ${currentIndex === i ? "active" : ""}`}
              aria-label={`${i + 1}枚目へ`}
            />
          ))}
        </div>
        <p className="text-[#64748B] text-xs mt-2">※AI活用による効果・削減時間・改善範囲は、対象業務および利用環境によって異なります。</p>
      </div>
    </section>
  );
}

// ── 2. EXAMPLES — メイン大型枠 + サムネイル切替 ──────────────────────────────
const exampleCases = [
  {
    category: "法人営業",
    id: "sales-marketing",
    beforeImg: asset("/images/ba-sales-before.png"),
    afterImg: asset("/images/ba-sales-after.png"),
    beforeAlt: "AI活用前の法人営業業務のイメージ",
    afterAlt: "AI活用後の法人営業業務のイメージ",
    before: "顧客情報の確認・課題整理・構成作成・提案書作成を全て手作業で行う",
    ai: "情報整理・構成・初稿を支援",
    after: "人は顧客理解と提案の仕上げに集中できる",
  },
  {
    category: "経理",
    id: "accounting-finance",
    beforeImg: asset("/images/ba-accounting-before.png"),
    afterImg: asset("/images/ba-accounting-after.png"),
    beforeAlt: "AI活用前の経理業務のイメージ",
    afterAlt: "AI活用後の経理業務のイメージ",
    before: "大量の数値・帳票を目視で確認し続ける",
    ai: "不整合・確認候補を整理",
    after: "人が重要箇所だけ最終確認できる",
  },
  {
    category: "製造",
    id: "manufacturing",
    beforeImg: asset("/images/ba-manufacturing-before.png"),
    afterImg: asset("/images/ba-manufacturing-after.png"),
    beforeAlt: "AI活用前の製造業務のイメージ",
    afterAlt: "AI活用後の製造業務のイメージ",
    before: "熟練者しか分からない作業が多く、技能継承が困難",
    ai: "手順・品質基準・ノウハウを整理",
    after: "標準化・教育・技能継承が進む",
  },
  {
    category: "旅行・観光",
    id: "travel",
    beforeImg: asset("/images/ba-travel-before.png"),
    afterImg: asset("/images/ba-travel-after.png"),
    beforeAlt: "AI活用前の旅行・観光業務のイメージ",
    afterAlt: "AI活用後の旅行・観光業務のイメージ",
    before: "料金計算・行程確認・企画・販促を個別に手作業で行う",
    ai: "計算・確認・整理・初稿作成を支援",
    after: "企画・顧客提案へ時間を使える",
  },
];

export function ExamplesSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const prevActive = useRef(0);
  // 全8枚の画像をコンポーネントマウント時にプリロード（切り替えラグ防止）
  useEffect(() => {
    exampleCases.forEach((c) => {
      const b = new Image(); b.src = c.beforeImg;
      const a = new Image(); a.src = c.afterImg;
    });
  }, []);

  const handleSelect = (i: number) => {
    if (i === active) return;
    setVisible(false);
    setTimeout(() => {
      setActive(i);
      prevActive.current = i;
      setVisible(true);
    }, 250);
  };

  const ex = exampleCases[active];
  return (
    <section id="examples" className="section-dark py-20 lg:py-28">
      <div className="container">
        <h2 className="section-heading text-3xl lg:text-4xl text-white mb-10">
          例えば、こんな仕事が変わります。
        </h2>
        <div className="grid lg:grid-cols-[1fr_220px] gap-6">
          {/* メイン大型枠 */}
          <div className="glass-card p-6 lg:p-8 rounded-2xl">
            <div className="text-[#e879b8] font-bold text-xs tracking-widest mb-4 uppercase"
              style={{ transition: "opacity 250ms", opacity: visible ? 1 : 0 }}>{ex.category}</div>
            {/* Before / After 画像 — 4:3比率固定でCLS防止 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6"
              style={{ transition: "opacity 250ms", opacity: visible ? 1 : 0 }}>
              {/* Before */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                {/* 4:3比率コンテナ — CLS防止 */}
                <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden", borderRadius: "0.5rem" }}>
                  <img
                    src={ex.beforeImg}
                    alt={ex.beforeAlt}
                    loading="eager"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
                <div className="text-white/40 text-xs font-bold uppercase tracking-wider mt-3 mb-2">Before</div>
                <p className="text-white/60 text-sm leading-relaxed">{ex.before}</p>
              </div>
              {/* After */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl" style={{ background: "rgba(163,55,123,0.12)", border: "1px solid rgba(163,55,123,0.3)" }}>
                {/* 4:3比率コンテナ — CLS防止 */}
                <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden", borderRadius: "0.5rem" }}>
                  <img
                    src={ex.afterImg}
                    alt={ex.afterAlt}
                    loading="eager"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
                <div className="text-[#e879b8] text-xs font-bold uppercase tracking-wider mt-3 mb-2">After</div>
                <p className="text-white font-semibold text-sm leading-relaxed">{ex.after}</p>
              </div>
            </div>
            {/* AI bridge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: "rgba(163,55,123,0.15)", transition: "opacity 250ms", opacity: visible ? 1 : 0 }}>
              <span className="text-[#e879b8] text-xs font-bold uppercase tracking-wider shrink-0">AI</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#A3377B]/50 to-transparent" />
              <p className="text-[#e879b8] text-xs">{ex.ai}</p>
            </div>
          </div>
          {/* サムネイル一覧 */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {exampleCases.map((c, i) => (
              <button
                key={c.category}
                onClick={() => handleSelect(i)}
                className={`shrink-0 lg:shrink text-left p-3 rounded-xl transition-all duration-200 border ${
                  active === i
                    ? "border-[#A3377B] bg-[#A3377B]/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                style={{ minWidth: "120px" }}
              >
                <div className="text-white/80 text-xs font-semibold">{c.category}</div>
                <div className="text-white/40 text-[0.65rem] mt-0.5 leading-tight">{c.before.slice(0, 20)}…</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 3. PAIN — 大型イラストカード3枚 ──────────────────────────────────────────
export function PainSection() {
  return (
    <section id="pain" className="section-white py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-4">
            その仕事、AIでもっと変えられる。
          </h2>
          <p className="text-[#64748B] leading-relaxed">
            まず見るべきは「どのAIを使うか」ではなく、<br />
            いま会社で時間・コスト・人手がかかっている仕事です。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
          {[
            { img: asset("/images/pain-time.png"), alt: "時間不足の課題イメージ", title: "時間が足りない", body: "やることが多すぎて、考える時間がない…" },
            { img: asset("/images/pain-dependency.png"), alt: "属人化・人依存の課題イメージ", title: "人に依存している", body: "ベテランにしか分からず、属人化している…" },
            { img: asset("/images/pain-outsource.png"), alt: "外注依存の課題イメージ", title: "外注し続けている", body: "コストがかさみ、ノウハウも社内に残らない…" },
          ].map((card, i) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#D9E0EA] bg-white"
            >
              <div className="mb-4 flex items-center justify-center" style={{ width: 140, height: 140 }}>
                <img src={card.img} alt={card.alt} loading="lazy"
                  style={{ width: 140, height: 140, objectFit: "contain", aspectRatio: "1/1" }} />
              </div>
              <h3 className="font-bold text-[#172554] text-lg mb-2">{card.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-block bg-[#172554] text-white px-8 py-4 rounded-xl">
            <p className="font-bold text-lg">だから、AIから考えない。<br className="sm:hidden" />業務課題からAI活用を設計する。</p>
          </div>
          <p className="text-[#64748B] text-xs mt-3">※AIで代替・効率化できる範囲は業務内容によって異なります。</p>
        </div>
      </div>
    </section>
  );
}

//
const REEL_STEPS = [
  { n: "01", label: "業務を整理する", desc: "今の仕事を棚卸しし、AIで変えられる業務候補を見つける。", img: asset("/images/reel-01-organize.png"), alt: "業務を整理するステップのイメージ" },
  { n: "02", label: "AIを使う仕事を決める", desc: "効果が高い仕事から優先して、AIを使う対象を絞り込む。", img: asset("/images/reel-02-decide.png"), alt: "AIを使う仕事を決めるステップのイメージ" },
  { n: "03", label: "実際にAIを使う", desc: "AIと一緒に実際の業務をやってみる。試して、慣れる。", img: asset("/images/reel-03-use.png"), alt: "実際にAIを使うステップのイメージ" },
  { n: "04", label: "成果物をつくる", desc: "提案書や資料など、仕事で使えるものを形にする。", img: asset("/images/reel-04-output.png"), alt: "成果物をつくるステップのイメージ" },
  { n: "05", label: "改善を続ける", desc: "効果を測りながら、もっと良くしていく。このサイクルを回す。", img: asset("/images/reel-05-improve.png"), alt: "改善を続けるステップのイメージ" },
];

// STEPS数 + 余韻区間(1.5) × 100vh
// 05表示後の余韻: 0.5vh（約0.5画面分）に抑える
// 旧: 1.5 → 新: 0.5
const REEL_OUTER_VH = REEL_STEPS.length + 0.5;

/**
 * ApproachSection — 縦方向スロットリール実装
 *
 * Layer 1: 実写画像（背景全面、左60%が主役）
 * Layer 2: Photo → Dark Navy グラデーション（右→左）
 * Layer 3: セクションタイトル（右側Dark Navyエリア）
 * Layer 4: translateY駆動の縦リール（右側）
 * Layer 5: active STEP説明文（右側）
 *
 * 旧IllustStep / IllustBeforeSales / SVGイラストは使用しない
 */
export function ApproachSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  // 連続的なprogress値（0〜STEPS-1）でリールをsmoothに動かす
  const [reelProgress, setReelProgress] = useState(0);
  const prefersReduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const outerHeight = outer.offsetHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (outerHeight - window.innerHeight)));
      // 0〜1 → 0〜(STEPS-1+0.5余韻) の連続値
      const raw = progress * REEL_OUTER_VH;
      const clamped = Math.min(REEL_STEPS.length - 1, raw);
      setReelProgress(clamped);
      setActiveStep(Math.min(REEL_STEPS.length - 1, Math.floor(raw)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1アイテムの高さ (px) — リールコンテナ高さの1/3
  const ITEM_H = 80;
  // リール全体をtranslateYで動かす量: activeが中央に来るように
  // 中央位置 = コンテナ高さ/2 - ITEM_H/2 = 120px
  // translateY = 120 - reelProgress * ITEM_H
  const CENTER_OFFSET = 120;
  const trackTranslateY = prefersReduced
    ? CENTER_OFFSET - activeStep * ITEM_H
    : CENTER_OFFSET - reelProgress * ITEM_H;

  // Reduced motion fallback
  if (prefersReduced) {
    return (
      <section id="approach" className="section-dark py-20 lg:py-28">
        <div className="container">
          <h2 className="section-heading text-3xl lg:text-4xl text-white mb-4">
            AIから考えない。<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>「仕事」から考える。</span>
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-xl">業務を起点に、AIを使う仕事を決め、実務で使い、成果物を作り、改善し続ける。</p>
          <div className="space-y-6">
            {REEL_STEPS.map((step) => (
              <div key={step.n} className="flex gap-4 items-start">
                <span className="font-inter font-extrabold text-2xl text-[#e879b8] shrink-0 w-10">{step.n}</span>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{step.label}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={outerRef} id="approach" style={{ height: `${REEL_OUTER_VH * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#172554" }}>

        {/* ── Layer 1: 実写画像（左60%が主役）— PCのみ表示 ── */}
        <div className="hidden lg:block" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {REEL_STEPS.map((step, i) => (
            <img
              key={step.n}
              src={step.img}
              alt={step.alt}
              loading={i === 0 ? "eager" : "lazy"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                opacity: i === activeStep ? 1 : 0,
                transition: "opacity 400ms ease",
              }}
            />
          ))}
        </div>

        {/* ── Layer 2: Photo → Dark Navy グラデーション（右→左）— PCのみ表示 ── */}
        <div className="hidden lg:block" style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(23,37,84,0.5) 48%, rgba(23,37,84,0.92) 60%, #172554 72%)",
        }} />

        {/* ── Layer 3〜5: コンテンツ（右側Dark Navyエリア） ── */}
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center" }}>
          <div className="container h-full flex items-center">
            {/* PC: 右側40%にコンテンツを配置 */}
            <div className="hidden lg:flex flex-col justify-center ml-auto" style={{ width: "42%", paddingLeft: "2rem" }}>
              {/* セクションタイトル */}
              <div className="mb-8">
                <h2 className="section-heading text-3xl lg:text-4xl text-white mb-2 leading-tight">
                  AIから考えない。<br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>
                    「仕事」から考える。
                  </span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  業務を起点に、AIを使う仕事を決め、<br />実務で使い、成果物を作り、改善し続ける。
                </p>
              </div>

              {/* 縦リール — translateY駆動 */}
              <div style={{
                height: `${ITEM_H * 3}px`,
                overflow: "hidden",
                perspective: "600px",
                perspectiveOrigin: "50% 50%",
                position: "relative",
              }}>
                {/* マスク: 上下をフェードアウト */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                  background: "linear-gradient(to bottom, #172554 0%, transparent 25%, transparent 75%, #172554 100%)",
                }} />
                {/* リールトラック — translateYで全体を動かす */}
                <div
                  style={{
                    transform: `translateY(${trackTranslateY}px)`,
                    transition: prefersReduced ? "none" : "transform 350ms cubic-bezier(0.23,1,0.32,1)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {REEL_STEPS.map((step, i) => {
                    const diff = i - reelProgress;
                    const absDiff = Math.abs(diff);
                    // active: diff≈0, 隣: absDiff≈1, 遠: absDiff≥2
                    const isActive = absDiff < 0.5;
                    const opacity = isActive ? 1 : absDiff < 1.5 ? 0.35 : 0.12;
                    const scale = isActive ? 1 : absDiff < 1.5 ? 0.91 : 0.82;
                    const rotateX = isActive ? 0 : diff < 0 ? Math.min(28, absDiff * 22) : -Math.min(28, absDiff * 22);
                    return (
                      <div
                        key={step.n}
                        style={{
                          height: `${ITEM_H}px`,
                          display: "flex",
                          alignItems: "center",
                          opacity,
                          transform: `scale(${scale}) rotateX(${rotateX}deg)`,
                          transformOrigin: "center center",
                          transition: "opacity 300ms ease, transform 350ms cubic-bezier(0.23,1,0.32,1)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="font-inter font-extrabold text-5xl leading-none shrink-0"
                            style={{
                              color: "transparent",
                              WebkitTextStroke: isActive ? "2px #e879b8" : "1.5px rgba(163,55,123,0.4)",
                              minWidth: "3rem",
                            }}
                          >
                            {step.n}
                          </span>
                          <h3
                            className="font-bold text-xl leading-tight"
                            style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.35)" }}
                          >
                            {step.label}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* active STEPの説明文 */}
              <div style={{ minHeight: "3rem", marginTop: "1rem" }}>
                <p
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ transition: "opacity 300ms ease" }}
                >
                  {REEL_STEPS[activeStep].desc}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1.5 mt-5">
                {REEL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 rounded-full transition-all duration-500"
                    style={{
                      width: i === activeStep ? "2rem" : "0.5rem",
                      background: i === activeStep ? "#e879b8" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* SP: タイトル → リール → 説明（画像なし、Dark Navy背景） */}
            <div className="lg:hidden w-full flex flex-col justify-center px-4" style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
              {/* SP セクションタイトル */}
              <h2 className="section-heading text-2xl text-white mb-6 leading-tight">
                AIから考えない。<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>「仕事」から考える。</span>
              </h2>
              {/* SP リール */}
              <div style={{ height: `${ITEM_H * 3}px`, overflow: "hidden", perspective: "400px", position: "relative", marginBottom: "0.75rem" }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                  background: "linear-gradient(to bottom, #172554 0%, transparent 25%, transparent 75%, #172554 100%)",
                }} />
                <div style={{
                  transform: `translateY(${trackTranslateY}px)`,
                  transition: "transform 350ms cubic-bezier(0.23,1,0.32,1)",
                  transformStyle: "preserve-3d",
                }}>
                  {REEL_STEPS.map((step, i) => {
                    const diff = i - reelProgress;
                    const absDiff = Math.abs(diff);
                    const isActive = absDiff < 0.5;
                    const opacity = isActive ? 1 : absDiff < 1.5 ? 0.35 : 0.1;
                    const scale = isActive ? 1 : 0.9;
                    const rotateX = isActive ? 0 : diff < 0 ? 20 : -20;
                    return (
                      <div
                        key={step.n}
                        style={{
                          height: `${ITEM_H}px`,
                          display: "flex",
                          alignItems: "center",
                          opacity,
                          transform: `scale(${scale}) rotateX(${rotateX}deg)`,
                          transformOrigin: "center center",
                          transition: "opacity 300ms ease, transform 350ms cubic-bezier(0.23,1,0.32,1)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-inter font-extrabold text-3xl leading-none shrink-0"
                            style={{ color: "transparent", WebkitTextStroke: isActive ? "2px #e879b8" : "1.5px rgba(163,55,123,0.4)", minWidth: "2.5rem" }}>
                            {step.n}
                          </span>
                          <h3 className="font-bold text-lg leading-tight"
                            style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.35)" }}>
                            {step.label}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* SP 説明文 */}
              <p className="text-white/60 text-sm leading-relaxed mb-4">{REEL_STEPS[activeStep].desc}</p>
              {/* SP Progress bar */}
              <div className="flex gap-1.5">
                {REEL_STEPS.map((_, i) => (
                  <div key={i} className="h-0.5 rounded-full transition-all duration-500"
                    style={{ width: i === activeStep ? "2rem" : "0.5rem", background: i === activeStep ? "#e879b8" : "rgba(255,255,255,0.2)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── 5. INDUSTRY — 横スライドカード ───────────────────────────────────────────
interface IndustryCard { name: string; id: string; items: string[]; }
export function IndustrySlider({ industryCards }: { industryCards: IndustryCard[] }) {
  const colors = ["#172554","#A3377B","#1e3a5f","#762A62","#1e2d6b","#4a1942","#243B72","#8B2252","#1a3a6b","#6B1F4A"];
  const { trackRef, currentIndex, maxIndex, swipeHintShown, scrollToIndex, trackHandlers, wasDrag } = useSlider(industryCards.length, 4);
  return (
    <section id="industry" className="section-white py-20 lg:py-28 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-4">
            あなたの業種では、AIをどう使える？
          </h2>
          <p className="text-[#64748B] leading-relaxed">業界ごとの実際の業務から、AI活用の可能性を確認できます。</p>
        </div>

        {/* ── Slider: container内でArrow・カード・見出しを同一グリッドに揃える ── */}
        <div className="relative">
          <button
            className="slider-arrow hidden lg:flex"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="前へ"
            style={{ left: "-1.25rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="slider-arrow hidden lg:flex"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex >= maxIndex}
            aria-label="次へ"
            style={{ right: "-1.25rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={trackRef}
            className="slider-track"
            style={{ paddingLeft: 0, paddingRight: "2rem" }}
            {...trackHandlers}
          >
            {industryCards.map((card, i) => (
              <div
                key={card.name}
                className="slider-card snap-start shrink-0"
                style={{ width: "clamp(200px, 22vw, 260px)" }}
              >
                <div className="h-full border border-[#D9E0EA] rounded-2xl p-5 bg-white hover:border-[#A3377B] hover:shadow-lg hover:shadow-[#A3377B]/10 transition-all duration-300 group cursor-pointer flex flex-col">
                  <div
                    className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: colors[i % colors.length] }}
                  >
                    {card.name.slice(0, 1)}
                  </div>
                  <h3 className="font-bold text-[#172554] text-sm mb-3 group-hover:text-[#A3377B] transition-colors leading-tight">{card.name}</h3>
                  <ul className="space-y-1 flex-1">
                    {card.items.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <span className="w-1 h-1 rounded-full bg-[#A3377B] shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="mt-4 flex w-fit items-center gap-1 text-[#A3377B] text-xs font-semibold transition-colors hover:text-[#762A62] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A3377B]"
                    aria-label={`${card.name}のカリキュラムを詳しく見る`}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => window.location.assign(`${url("/curriculum-industry")}#${card.id}`)}
                  >
                    詳しく見る <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
            <div className="shrink-0 w-4" />
          </div>

          {swipeHintShown && (
            <div className="lg:hidden absolute bottom-14 right-0 flex items-center gap-1 text-[#A3377B] text-[0.65rem] font-semibold opacity-70 pointer-events-none">
              横にスライド <ArrowRight size={10} />
            </div>
          )}
        </div>

        <div className="flex gap-1.5 mt-4 mb-6">
          {industryCards.map((_, i) => (
            <button key={i} onClick={() => scrollToIndex(i)} className={`slider-dot ${currentIndex === i ? "active" : ""}`} aria-label={`${i + 1}枚目へ`} />
          ))}
        </div>
        <a href={url("/curriculum-industry")} onClick={(e) => { e.preventDefault(); window.location.href = url("/curriculum-industry"); }} className="btn-primary inline-flex">
          業種別カリキュラムをすべて見る <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

// ── 6. JOB — タブ切替 + 大型カード ──────────────────────────────────────────
interface JobCard { name: string; id: string; items: string[]; }
export function JobTabSection({ jobCards }: { jobCards: JobCard[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const card = jobCards[activeTab];
  const jobDetails: Record<string, { desc: string; aiUses: string[] }> = {
    "sales-marketing": { desc: "顧客開拓・提案書作成・商談対応・マーケティング施策立案・実行", aiUses: ["顧客課題の整理・提案構成の初稿生成", "競合・市場情報の要約", "マーケティング施策の企画書・コピー生成"] },
    "pr": { desc: "プレスリリース・SNS投稿・取材準備・情報発信・ブランド管理", aiUses: ["プレスリリースの初稿生成", "SNS投稿文の量産", "取材準備資料の整理"] },
    "creative": { desc: "企画・構成・コピー制作・画像生成活用・制作指示書作成", aiUses: ["企画・構成の初稿生成", "コピーのバリエーション量産", "制作指示書の自動化"] },
    "hr": { desc: "求人票作成・研修資料・オンボーディング・評価文書管理", aiUses: ["求人票の初稿生成", "研修資料・マニュアルの作成", "評価コメントの整理"] },
    "general-affairs-contract": { desc: "契約確認・差分チェック・社内文書管理・期限管理", aiUses: ["契約書の確認候補整理", "差分チェックの効率化", "社内文書の標準化"] },
    "accounting-finance": { desc: "数値確認・集計レポート・予実管理・異常値整理", aiUses: ["数値の確認候補整理", "集計レポートの初稿生成", "予実差異の要因整理"] },
    "customer-support": { desc: "回答案生成・FAQ整備・VOC分析・ナレッジ整理", aiUses: ["回答案の自動生成", "FAQの整備・更新", "VOC分析と改善提案"] },
  };
  const detail = jobDetails[card.id] ?? { desc: card.items.join("・"), aiUses: card.items };
  return (
    <section id="job" className="section-light py-20 lg:py-28">
      <div className="container">
        <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-8">
          職種から、AIで変えられる仕事を探す。
        </h2>
        {/* タブ */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
          {jobCards.map((j, i) => (
            <button
              key={j.name}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                activeTab === i
                  ? "bg-[#172554] text-white border-[#172554]"
                  : "bg-white text-[#64748B] border-[#D9E0EA] hover:border-[#A3377B] hover:text-[#A3377B]"
              }`}
            >
              {j.name}
            </button>
          ))}
        </div>
        {/* 大型カード */}
        <div className="bg-white border border-[#D9E0EA] rounded-2xl p-6 lg:p-8 mb-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <h3 className="font-bold text-[#172554] text-xl mb-2">{card.name}</h3>
              <p className="text-[#64748B] text-sm mb-5">{detail.desc}</p>
              <div className="mb-4">
                <div className="text-[#A3377B] text-xs font-bold uppercase tracking-wider mb-3">AIで変えられる業務</div>
                <ul className="space-y-2">
                  {detail.aiUses.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-sm text-[#111827]">
                      <ChevronRight size={14} className="text-[#A3377B] shrink-0 mt-0.5" />{u}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-3">代表業務</div>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <span key={item} className="text-xs bg-[#F7F8FC] border border-[#D9E0EA] text-[#64748B] px-3 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* 小イラスト */}
          </div>
          <div className="mt-6 pt-5 border-t border-[#D9E0EA]">
            <a
              href={`/curriculum-job#${card.id}`}
              onClick={(e) => { e.preventDefault(); window.location.href = `${url("/curriculum-job")}#${card.id}`; }}
              className="inline-flex items-center gap-1.5 text-[#A3377B] text-sm font-semibold hover:gap-2.5 transition-all"
            >
              詳しいカリキュラムを見る <ChevronRight size={14} />
            </a>
          </div>
        </div>
        <div className="text-center">
          <a href={url("/curriculum-job")} onClick={(e) => { e.preventDefault(); window.location.href = url("/curriculum-job"); }} className="btn-primary inline-flex">
            職種別カリキュラムをすべて見る <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 7. DELIVERABLES — コラージュビジュアル ──────────────────────────────────
export function DeliverablesSection() {
  const deliverables = [
    { type: "proposal", label: "営業提案書" },
    { type: "marketing", label: "マーケ企画書" },
    { type: "pr", label: "PR記事・原稿" },
    { type: "contract", label: "契約書チェック" },
    { type: "report", label: "経理・分析レポート" },
    { type: "manual", label: "業務マニュアル" },
    { type: "system", label: "生産管理システム" },
    { type: "travel", label: "旅行企画資料" },
  ];
  return (
    <section id="deliverables" className="section-dark py-20 lg:py-28">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-heading text-3xl lg:text-4xl text-white mb-4">
            学んだ知識ではなく、<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e879b8, #A3377B)" }}>
              「会社で使えるもの」が残る。
            </span>
          </h2>
          <p className="text-white/60">研修の成果物は、そのまま実務で使える資産です。</p>
        </div>
        {/* コラージュグリッド */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 max-w-5xl mx-auto">
          {deliverables.map((d, i) => (
            <div key={d.type} className="flex flex-col items-center gap-2">
              <div
                className="w-full flex items-center justify-center rounded-xl py-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <IllustDeliverable type={d.type} size={60} />
              </div>
              <span className="text-white/60 text-[0.6rem] text-center leading-tight">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 8. OVERVIEW — スペック数値大型表示 ──────────────────────────────────────
export function OverviewSection() {
  return (
    <section id="overview" className="section-white py-20 lg:py-28">
      <div className="container">
        <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-12 text-center">
          研修概要
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {[
            { icon: "⏱", value: "12h+", label: "標準研修時間" },
            { icon: "👥", value: "5名〜", label: "最低受講人数" },
            { icon: "💻", value: "3形式", label: "対面 / オンライン / ハイブリッド" },
            { icon: "🗾", value: "全国", label: "対応地域（要調整）" },
            { icon: "📋", value: "棚卸し付", label: "無料相談に含む" },
          ].map((spec, i) => (
            <div
              key={spec.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#F7F8FC] border border-[#D9E0EA]"
            >
              <div className="text-3xl mb-2">{spec.icon}</div>
              <div className="font-inter font-extrabold text-2xl text-[#172554] mb-1">{spec.value}</div>
              <div className="text-[#64748B] text-xs leading-tight">{spec.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 9. REGULATION — 左右比較図解 ────────────────────────────────────────────
export function RegulationSection() {
  return (
    <section id="regulation" className="section-light py-20 lg:py-28">
      <div className="container max-w-4xl">
        <h2 className="section-heading text-3xl lg:text-4xl text-[#172554] mb-10 text-center">
          AI研修は、<br />「何を学ぶか」より「どの仕事に使うか」。
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* 左: 一般的なAI研修 */}
          <div className="p-6 rounded-2xl bg-white border border-[#D9E0EA]">
            <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-4">一般的なAI研修</div>
            <ul className="space-y-3">
              {["AIとは何か", "基本操作を学ぶ", "汎用プロンプトを試す"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#D9E0EA] shrink-0" />{item}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-[#D9E0EA]">
              <p className="text-xs text-[#94A3B8]">→ 研修後、実務での使い方が分からない</p>
            </div>
          </div>
          {/* 中央: VS */}
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #A3377B, #762A62)" }}>VS</div>
          </div>
          {/* 右: 職務直結型 */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#A3377B]/40">
            <div className="text-[#A3377B] text-xs font-bold uppercase tracking-wider mb-4">職務直結型AI研修</div>
            <ul className="space-y-3">
              {[
                { job: "営業", task: "提案書・顧客整理" },
                { job: "経理", task: "確認・分析レポート" },
                { job: "製造", task: "生産管理・品質確認" },
                { job: "旅行", task: "料金計算・行程整理" },
              ].map((item) => (
                <li key={item.job} className="flex items-center gap-2 text-sm text-[#111827]">
                  <ChevronRight size={12} className="text-[#A3377B] shrink-0" />
                  <span className="font-semibold text-[#172554]">{item.job}</span>
                  <span className="text-[#64748B]">→ {item.task}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-[#A3377B]/20">
              <p className="text-xs text-[#A3377B] font-semibold">→ 研修後すぐに実務で使える成果物が残る</p>
            </div>
          </div>
        </div>
        <p className="text-[#64748B] text-xs mt-4">※助成金の対象可否は、企業・受講者・訓練内容等の要件および労働局の審査により判断されます。</p>
      </div>
    </section>
  );
}
