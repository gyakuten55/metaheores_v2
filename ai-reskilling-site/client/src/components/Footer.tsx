/**
 * Footer — Meta Heroes AI Reskilling Site
 * Design: Enterprise Depth — Dark Navy
 */
import { Link } from "wouter";
import { asset, url } from "@/lib/paths";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white/60 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-[#243B72] flex items-center justify-center">
                <img src={asset("/images/logo_mh.png")} alt="Meta Heroes" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-bold text-sm">Meta Heroes</span>
            </div>
            <p className="text-sm leading-relaxed">
              テクノロジーと教育の融合で、<br />
              社会課題を楽しく学べる体験に変えるEdTechカンパニー
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">生成AIリスキリング研修</Link></li>
              <li><Link href="/curriculum-job" className="hover:text-white transition-colors">職種別カリキュラム</Link></li>
              <li><Link href="/curriculum-industry" className="hover:text-white transition-colors">業種別カリキュラム</Link></li>
              <li><Link href="/subsidy" className="hover:text-white transition-colors">人材開発支援助成金</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">お問い合わせ</h4>
            <p className="text-sm mb-4">無料カリキュラム相談は随時受け付けています。</p>
            <a href={`${url("/")}#consultation`} className="btn-primary text-sm py-2.5 px-5 inline-flex">
              無料相談を申し込む
            </a>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 株式会社Meta Heroes. All rights reserved.</p>
          <p className="text-white/40">
            助成金の支給可否は企業・受講者・訓練内容等の要件および労働局の審査によります。支給を保証するものではありません。
          </p>
        </div>
      </div>
    </footer>
  );
}
