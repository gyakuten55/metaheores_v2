/**
 * Subsidy — 人材開発支援助成金 活用ガイド v2
 * コピー: 言い切り表現へ変更・注釈を近接配置
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight, ChevronDown, ExternalLink } from "lucide-react";

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

const subsidyFaqs = [
  { q: "どんな企業が対象になりますか？", a: "雇用保険適用事業主が対象です。詳細な要件は厚生労働省の最新パンフレット・支給要領をご確認ください。" },
  { q: "AI研修は助成金の対象になりますか？", a: "職務に関連した訓練であれば対象となる場合があります。ただし、訓練内容・受講者・実施方法等の要件を満たす必要があります。詳細は都道府県労働局にご確認ください。" },
  { q: "申請はどのように行いますか？", a: "訓練実施前に計画届の提出が必要です。申請手続きの詳細は厚生労働省または都道府県労働局にご確認ください。Meta Heroesでは情報提供・サポートを行いますが、申請代行は行いません。" },
  { q: "助成金は必ず受給できますか？", a: "助成金の支給可否は、企業・受講者・訓練内容等の要件および労働局の審査によります。支給を保証するものではありません。" },
  { q: "助成金の申請と研修の発注はどちらが先ですか？", a: "原則として、訓練開始前に計画届の提出が必要です。発注・手続きの順序については、無料カリキュラム相談でご案内します。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D9E0EA] last:border-0">
      <button className="w-full text-left py-5 flex items-start justify-between gap-4 group" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="font-semibold text-[#111827] group-hover:text-[#A3377B] transition-colors leading-relaxed">{q}</span>
        <ChevronDown size={20} className={`shrink-0 mt-0.5 text-[#A3377B] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-[#64748B] leading-relaxed text-sm">{a}</div>}
    </div>
  );
}

export default function Subsidy() {
  useReveal();

  // Ensure page always starts at top — prevent browser scroll restoration
  useEffect(() => {
    // Override browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Force scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      {/* Hero */}
      <section className="pt-28 pb-16" style={{ background: "linear-gradient(135deg, #0f1f4a 0%, #172554 60%, #1e2d6b 100%)" }}>
        {/* Hero: 本文と同じ中央軸 (max-w-3xl mx-auto) + 中央揃え */}
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Breadcrumb — 中央揃え */}
            <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">ホーム</Link>
              <ChevronRight size={12} />
              <span>人材開発支援助成金</span>
            </div>
            {/* H1 — 中央揃え、横広がりを抑える */}
            <h1 className="section-heading text-3xl lg:text-5xl text-white mb-5 reveal leading-tight">
              助成金を活用して、<br />AI人材育成の負担を抑える。
            </h1>
            {/* リード文 — 中央揃え */}
            <p className="text-white/60 leading-relaxed reveal mx-auto max-w-xl text-sm lg:text-base">
              人材開発支援助成金は、厚生労働省が設ける制度です。要件・助成率・上限額は訓練内容や企業規模等により異なります。
              本ページの情報は参考情報であり、支給を保証するものではありません。
              最新の要件は必ず一次資料（厚生労働省・都道府県労働局）でご確認ください。
            </p>
            {/* バッジ — 中央揃え */}
            <div className="flex flex-wrap gap-3 mt-6 reveal justify-center">
              <span className="subsidy-badge">厚生労働省制度</span>
              <span className="subsidy-badge">活用件数50件以上</span>
              <span className="subsidy-badge">支給保証なし・正確な情報提供</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is subsidy */}
      <section className="section-light py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-[#172554] mb-8 reveal">人材開発支援助成金とは</h2>
          <div className="space-y-4 text-[#111827] leading-relaxed reveal">
            <p>人材開発支援助成金は、事業主が雇用する労働者に対して、職務に関連した専門的な知識・技能を習得させるための職業訓練等を実施した場合に、訓練経費や訓練期間中の賃金の一部を助成する厚生労働省の制度です。</p>
            <p>複数のコースがあり、それぞれ対象となる訓練の種類・要件・助成率・上限額が異なります。AI研修については、職務との関連性が重要な要件のひとつとなります。</p>
          </div>
          <div className="mt-6 p-4 bg-white border border-[#D9E0EA] rounded-xl reveal">
            <div className="flex items-start gap-3">
              <ExternalLink size={16} className="text-[#A3377B] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#172554] mb-1">一次資料（厚生労働省）</p>
                <a href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html" target="_blank" rel="noopener noreferrer" className="text-[#A3377B] text-sm hover:underline">
                  人材開発支援助成金 | 厚生労働省
                </a>
                <p className="text-[#64748B] text-xs mt-1">※ 公開直前に最新パンフレット・支給要領・申請様式を再確認してください。</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Job relevance */}
      <section className="section-white py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-[#172554] mb-8 reveal">
            AI研修は、「何を学ぶか」より「どの仕事に使うか」。
          </h2>
          <div className="space-y-4 text-[#111827] leading-relaxed reveal">
            <p>人材開発支援助成金では、訓練が受講者の職務に関連していることが要件のひとつです。汎用的なAIツールの使い方を学ぶだけでなく、受講者の実際の職務・担当業務に結びついた訓練内容であることが求められます。</p>
            <p>Meta Heroesの研修は、業種・職種・実際の担当業務から逆算してカリキュラムを設計するため、職務関連性の観点からも整合しやすい設計となっています。ただし、要件の充足は個別の状況・審査によります。</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 reveal">
            <div className="p-5 bg-[#F7F8FC] border border-[#D9E0EA] rounded-xl">
              <div className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">一般的なAI研修</div>
              <p className="text-sm text-[#64748B]">AIツールの使い方・プロンプトを学ぶ汎用研修</p>
            </div>
            <div className="p-5 bg-white border border-[#A3377B]/30 rounded-xl">
              <div className="text-[#A3377B] text-xs font-bold uppercase tracking-wider mb-2">職務直結型研修</div>
              <p className="text-sm text-[#111827]">受講者の実際の職務・担当業務に結びついた実践型研修</p>
            </div>
          </div>
          <p className="text-[#64748B] text-xs mt-3 reveal">※助成金の対象可否は、企業・受講者・訓練内容等の要件および労働局の審査により判断されます。</p>
          </div>
        </div>
      </section>

      {/* Cost example */}
      <section className="section-navy py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-white mb-4 reveal">5名で受講した場合の費用イメージ</h2>
          <p className="text-white/60 text-sm mb-6 reveal">※ 以下はあくまで参考例です。実際の助成額・支給可否は企業・受講者・訓練内容等の要件および労働局の審査によります。</p>
          <div className="glass-card p-8 reveal">
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <div className="text-white/50 text-xs mb-2">研修費用（5名）</div>
                <div className="text-white font-bold text-2xl font-inter">200万円</div>
                <div className="text-white/40 text-xs mt-1">1名40万円 × 5名</div>
              </div>
              <div className="text-center">
                <div className="text-white/50 text-xs mb-2">助成金活用例</div>
                <div className="text-[#e879b8] font-bold text-2xl font-inter">▲150万円</div>
                <div className="text-white/40 text-xs mt-1">要件・審査による</div>
              </div>
              <div className="text-center">
                <div className="text-white/50 text-xs mb-2">実質負担例</div>
                <div className="text-white font-bold text-3xl font-inter">50万円</div>
                <div className="text-[#e879b8] text-xs mt-1 font-semibold">1名あたり実質10万円</div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-1">
              <p className="text-white/50 text-xs">※所定の要件を満たし、想定する助成額が認められた場合の一例です。助成金の支給・助成額を保証するものではありません。</p>
              <p className="text-white/40 text-xs">標準研修費：1名40万円 ※研修内容・時間・人数等により異なる場合があります。</p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="section-light py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-[#172554] mb-12 reveal">研修・助成金活用を検討する流れ</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#D9E0EA]" />
            {[
              { step: "無料カリキュラム相談", note: "業務ヒアリング・カリキュラム提案・助成金活用の情報提供" },
              { step: "訓練計画の検討", note: "受講者・対象業務・カリキュラムの整理" },
              { step: "計画届の提出（訓練開始前）", note: "都道府県労働局への提出が必要。詳細は労働局にご確認ください。" },
              { step: "発注・必要手続き", note: "" },
              { step: "研修実施", note: "" },
              { step: "支給申請", note: "訓練終了後、所定の期間内に申請。詳細は労働局にご確認ください。" },
            ].map((item, i) => (
              <div key={item.step} className="relative flex items-start gap-5 pb-8 last:pb-0 reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-inter shrink-0 mt-0.5 ${i === 0 ? "bg-[#A3377B] text-white" : "bg-white border-2 border-[#D9E0EA] text-[#64748B]"}`}>{i + 1}</div>
                <div>
                  <div className={`font-semibold ${i === 0 ? "text-[#A3377B]" : "text-[#111827]"}`}>{item.step}</div>
                  {item.note && <p className="text-[#64748B] text-sm mt-1">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Meta Heroes support */}
      <section className="section-white py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-[#172554] mb-8 reveal">Meta Heroesのサポート範囲</h2>
          <div className="space-y-4 reveal">
            {[
              { label: "情報提供", desc: "助成金制度の概要・活用可能性についての情報提供を行います。" },
              { label: "カリキュラム設計", desc: "職務関連性を考慮したカリキュラムの設計・提案を行います。" },
              { label: "申請代行は行いません", desc: "申請手続きは企業様ご自身または社労士等の専門家にご依頼ください。", warning: true },
            ].map((item) => (
              <div key={item.label} className={`flex items-start gap-4 p-5 rounded-xl border ${item.warning ? "bg-amber-50 border-amber-200" : "bg-[#F7F8FC] border-[#D9E0EA]"}`}>
                <div className={`w-1 h-full min-h-8 rounded-full shrink-0 ${item.warning ? "bg-amber-400" : "bg-[#A3377B]"}`} />
                <div>
                  <div className={`font-bold text-sm mb-1 ${item.warning ? "text-amber-700" : "text-[#172554]"}`}>{item.label}</div>
                  <p className={`text-sm ${item.warning ? "text-amber-600" : "text-[#64748B]"}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
          <h2 className="section-heading text-2xl lg:text-3xl text-[#172554] mb-10 reveal">助成金に関するFAQ</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-[#D9E0EA] p-6 lg:p-8 reveal">
            {subsidyFaqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-heading text-2xl lg:text-3xl text-white mb-4 reveal">助成金活用も含めて、まずは相談する。</h2>
          <p className="text-white/60 mb-8 reveal">無料カリキュラム相談では、助成金活用の可能性についての情報提供も行います。</p>
          <a href="/#consultation" className="btn-primary inline-flex reveal">
            無料カリキュラム相談を申し込む <ArrowRight size={16} />
          </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
