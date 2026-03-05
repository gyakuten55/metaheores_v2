import { Routes, Route, useLocation } from 'react-router-dom';
import { SEO } from './components/SEO';
import { ScrollToTop } from './components/ScrollToTop';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { MemberPage } from './pages/MemberPage';
import { MemberListPage } from './pages/MemberListPage';
import { NewsPage } from './pages/NewsPage';
import { WorksPage } from './pages/WorksPage';
import { TopPage } from './pages/TopPage';
import { AboutPage } from './pages/AboutPage';
import { AboutCompanyPage } from './pages/AboutCompanyPage';
import { BusinessContentPage } from './pages/BusinessContentPage';
import { ServicesPage } from './pages/ServicesPage';
import { XrSolutionsPage } from './pages/services/XrSolutionsPage';
import { HolosharePage } from './pages/services/HolosharePage';
import { HeroAivoPage } from './pages/services/HeroAivoPage';
import { AiTrainingPage } from './pages/services/AiTrainingPage';
import { BousaiMetaversePage } from './pages/services/BousaiMetaversePage';
import { BousaiExpoPage } from './pages/services/BousaiExpoPage';
import { HeroEggCollectionPage } from './pages/services/HeroEggCollectionPage';
import { HeroExpoPage } from './pages/services/HeroExpoPage';
import { GlobalHeroSummitPage } from './pages/services/GlobalHeroSummitPage';
import { EggJamPage } from './pages/services/EggJamPage';
import { AiMondayPage } from './pages/services/AiMondayPage';
import { GameEventPage } from './pages/services/GameEventPage';
import { GameMakingCampPage } from './pages/services/GameMakingCampPage';
import { HeroEggPage } from './pages/services/HeroEggPage';
import { MetaHeroesGuildPage } from './pages/services/MetaHeroesGuildPage';
import { CeoMessagePage } from './pages/CeoMessagePage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { MissionPage } from './pages/MissionPage';
import { OfficesPage } from './pages/OfficesPage';
import { CodeOfConductPage } from './pages/CodeOfConductPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { GroupCompaniesPage } from './pages/GroupCompaniesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { ContactPrivacyPage } from './pages/ContactPrivacyPage';
import { DocumentRequestPage } from './pages/DocumentRequestPage';
import { RecruitPage } from './pages/RecruitPage';
import { FAQPage } from './pages/FAQPage';
import { MemberBlogPage } from './pages/MemberBlogPage';

import LoginPage from './pages/agency/LoginPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AgencyLayout from './pages/agency/AgencyLayout';
import DashboardPage from './pages/agency/DashboardPage';
import DocumentsPage from './pages/agency/DocumentsPage';
import VideosPage from './pages/agency/VideosPage';
import EventsPage from './pages/agency/EventsPage';
import LinksPage from './pages/agency/LinksPage';
import { AdminPage } from './pages/agency/Placeholders';

function App() {
  const location = useLocation();
  const isAgencyPage = location.pathname === '/agency-login' || location.pathname.startsWith('/agency');

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        {!isAgencyPage && (
          <>
            <Header />
            <div className="pt-16 sm:pt-20 lg:pt-24 absolute top-0 left-0 right-0 z-[100]">
              <Breadcrumbs />
            </div>
          </>
        )}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <SEO 
                  title="株式会社MetaHeroes | ヒーローと共創するメタバース・AIカンパニー" 
                  description="株式会社MetaHeroesは、メタバース、AI、XR技術を駆使して社会課題を解決するインパクト・ビジネスを展開。2044年までに100のHEROを創出するビジョンのもと、教育・防災・地方創生の革新に挑みます。"
                  schema={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "株式会社MetaHeroes",
                    "url": "https://meta-heroes.co.jp/",
                    "logo": "https://meta-heroes.co.jp/assets/logo.png",
                    "description": "メタバース・AI・XRで社会課題を解決し、日本の未来をワクワクさせるインパクト・ビジネスを展開。",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "堂山町1-5 三共梅田ビル 8F",
                      "addressLocality": "大阪市北区",
                      "addressRegion": "大阪府",
                      "postalCode": "530-0027",
                      "addressCountry": "JP"
                    },
                    "founder": {
                      "@type": "Person",
                      "name": "松石 和俊"
                    },
                    "foundingDate": "2021-12-03"
                  }}
                />
                <TopPage />
              </>
            } />
            
            {/* Agency Routes */}
            <Route path="/agency-login" element={<><SEO title="代理店ログイン | 株式会社MetaHeroes" /><LoginPage /></>} />
            <Route path="/agency" element={
              <ProtectedRoute>
                <AgencyLayout />
              </ProtectedRoute>
            }>
              <Route index element={<><SEO title="代理店ダッシュボード | 株式会社MetaHeroes" /><DashboardPage /></>} />
              <Route path="documents" element={<><SEO title="資料ライブラリ | 株式会社MetaHeroes" /><DocumentsPage /></>} />
              <Route path="videos" element={<><SEO title="動画ライブラリ | 株式会社MetaHeroes" /><VideosPage /></>} />
              <Route path="events" element={<><SEO title="イベント情報 | 株式会社MetaHeroes" /><EventsPage /></>} />
              <Route path="links" element={<><SEO title="関連リンク | 株式会社MetaHeroes" /><LinksPage /></>} />
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SEO title="管理者設定 | 株式会社MetaHeroes" />
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="/about" element={<><SEO title="MetaHeroesについて | 株式会社MetaHeroes" description="株式会社MetaHeroesのビジョン、ミッション、そして2044年に向けた100のHERO創出計画についてご紹介します。" /><AboutPage /></>} />
            <Route path="/about/company" element={<><SEO title="会社概要 | 株式会社MetaHeroes" /><AboutCompanyPage /></>} />
            <Route path="/about/profile" element={<><SEO title="企業プロフィール | 株式会社MetaHeroes" /><CompanyProfilePage /></>} />
            <Route path="/about/mission" element={<><SEO title="ミッション・ビジョン | 株式会社MetaHeroes" description="「Society 5.0 × SDGs × HERO」デジタルの力で社会課題を解決し、誰もがヒーローになれる世界を目指します。" /><MissionPage /></>} />
            <Route path="/about/offices" element={<><SEO title="オフィス案内 | 株式会社MetaHeroes" /><OfficesPage /></>} />
            <Route path="/about/conduct" element={<><SEO title="行動指針 | 株式会社MetaHeroes" /><CodeOfConductPage /></>} />
            <Route path="/about/privacy" element={<><SEO title="プライバシーポリシー | 株式会社MetaHeroes" /><PrivacyPolicyPage /></>} />
            <Route path="/about/group" element={<><SEO title="グループ会社 | 株式会社MetaHeroes" /><GroupCompaniesPage /></>} />
            <Route path="/business" element={<><SEO title="事業内容 | 株式会社MetaHeroes" description="教育、防災、地方創生の3領域におけるメタバース・AI活用ソリューションを提供しています。" /><BusinessContentPage /></>} />

            <Route path="/gallery" element={<><SEO title="ギャラリー | 株式会社MetaHeroes" /><GalleryPage /></>} />
            <Route path="/contact/privacy" element={<><SEO title="個人情報の取り扱いについて | 株式会社MetaHeroes" /><ContactPrivacyPage /></>} />
            <Route path="/contact" element={<><SEO title="お問い合わせ | 株式会社MetaHeroes" /><ContactPage /></>} />
            <Route path="/document-request" element={<><SEO title="お役立ち資料 | 株式会社MetaHeroes" /><DocumentRequestPage /></>} />
            <Route path="/recruit" element={<><SEO title="採用情報 | 株式会社MetaHeroes" description="次世代の社会基盤を創るHEROを募集しています。メタバース・AIの力で世界をワクワクさせませんか？" /><RecruitPage /></>} />
            <Route path="/faq" element={<><SEO title="よくある質問 | 株式会社MetaHeroes" /><FAQPage /></>} />
            <Route path="/services" element={<><SEO title="サービス一覧 | 株式会社MetaHeroes" /><ServicesPage /></>} />
            <Route path="/services/xr" element={<><SEO title="XRソリューション | VR・MRによる没入型課題解決 | 株式会社MetaHeroes" description="VR/AR/MR技術を駆使し、場所や時間の制約を超えた没入体験を提供。防災・教育・地域創生など、実社会の「不」を解消する最新のXRソリューションをオーダーメイドで構築します。" keywords="VR, AR, MR, 没入体験, デジタルツイン, メタバース開発, UEFN" /><XrSolutionsPage /></>} />
            <Route path="/services/holoshare" element={<><SEO title="HoloShare | ホログラム・XR共有プラットフォーム | 株式会社MetaHeroes" /><HolosharePage /></>} />
            <Route path="/services/hero-aivo" element={<><SEO title="HERO AIVO | AI検索最適化(LLMO)診断・Web制作 | 株式会社MetaHeroes" description="AI検索（ChatGPT/Perplexity等）が主流になる時代。情報の誤認識を防ぎ、AIから正しく引用・推奨されるWebサイトへと最適化する国内屈指のLLMOソリューション。" keywords="LLMO, AI検索最適化, AI集客, Web制作, HERO AIVO" /><HeroAivoPage /></>} />
            <Route path="/services/ai-training" element={<><SEO title="AI人材育成研修 | 実務に直結するDXリスキリング | 株式会社MetaHeroes" description="15,000名以上の実績を誇る実践的AI研修。単なるツールの習得ではなく、自社の課題をAIで解決する「AIリテラシー」を底上げし、組織全体の生産性を向上させます。" keywords="AI研修, DX研修, リスキリング, 生産性向上, 生成AI活用" /><AiTrainingPage /></>} />
            <Route path="/services/bousai-metaverse" element={<><SEO title="防災メタバース | 没入型防災教育・訓練シミュレーション | 株式会社MetaHeroes" description="「教えられる防災」から「自ら学ぶ防災」へ。仮想空間での火災・浸水体験を通じ、高い没入感で危機意識を自分事化させる、自治体・教育機関向けの次世代防災教育。" keywords="防災教育, 避難訓練, VR防災, シミュレーション, 自治体DX" /><BousaiMetaversePage /></>} />
            <Route path="/services/bousai-expo" element={<><SEO title="防災万博 | 株式会社MetaHeroes" /><BousaiExpoPage /></>} />
            <Route path="/services/hero-egg-collection" element={<><SEO title="Hero Egg Collection | 株式会社MetaHeroes" /><HeroEggCollectionPage /></>} />
            <Route path="/services/hero-egg" element={<><SEO title="Hero Egg | 子どもから大人まで学べるDX教育施設 | 株式会社MetaHeroes" description="すべてのこどもに「ヒーロー」の卵を。10GBの超高速回線やハイスペックPCを完備し、次世代のテクノロジーを楽しみながら学べるDX教育プラットフォーム。" keywords="Hero Egg, DX教育, メタバース教育, プログラミング, 子ども教育" /><HeroEggPage /></>} />
            <Route path="/services/game-making-camp" element={<><SEO title="ゲームメイキングキャンプ | 親子で学ぶゲーム制作体験 | 株式会社MetaHeroes" description="プロの講師から学ぶ、子ども向けゲーム制作ワークショップ。Fortnite（UEFN）やRobloxなどを通じて、論理的思考力とクリエイティビティを育みます。" keywords="ゲーム制作, UEFN, Roblox, プログラミング教室, 夏休みイベント" /><GameMakingCampPage /></>} />
            <Route path="/services/hero-expo" element={<><SEO title="HERO EXPO | 次世代DX体験イベント | 株式会社MetaHeroes" /><HeroExpoPage /></>} />
            <Route path="/services/global-hero-summit" element={<><SEO title="Global Hero Summit | 株式会社MetaHeroes" /><GlobalHeroSummitPage /></>} />
            <Route path="/services/egg-jam" element={<><SEO title="EGG JAM | 株式会社MetaHeroes" /><EggJamPage /></>} />
            <Route path="/services/ai-monday" element={<><SEO title="AI MONDAY | 生成AI実践学習コミュニティ | 株式会社MetaHeroes" description="毎週月曜日開催。生成AIの最新情報を学び、アウトプットする実践型コミュニティ。AIライト層からビジネスリーダーまで、共に学び成長する場を提供します。" /><AiMondayPage /></>} />
            <Route path="/services/game-event" element={<><SEO title="ゲーム×イベント | 没入型プロモーション | 株式会社MetaHeroes" /><GameEventPage /></>} />
            <Route path="/services/meta-heroes-guild" element={<><SEO title="Meta Heroes Guild | クリエイター共創コミュニティ | 株式会社MetaHeroes" /><MetaHeroesGuildPage /></>} />
            <Route path="/ceo-message" element={<><SEO title="代表メッセージ | 株式会社MetaHeroes" /><CeoMessagePage /></>} />
            <Route path="/news" element={<><SEO title="ニュース | 株式会社MetaHeroes" /><NewsPage /></>} />
            <Route path="/works" element={<><SEO title="制作実績 | 株式会社MetaHeroes" /><WorksPage /></>} />
            <Route path="/members/blog" element={<><SEO title="メンバーブログ | 株式会社MetaHeroes" /><MemberBlogPage /></>} />
            <Route path="/members" element={<><SEO title="メンバー紹介 | 株式会社MetaHeroes" /><MemberListPage /></>} />
            <Route path="/member/:memberId" element={<MemberPage />} />
            <Route path="/news/:blogId" element={<BlogDetailPage />} />
            <Route path="/member-blog/:blogId" element={<BlogDetailPage />} />
          </Routes>
        </div>
        {!isAgencyPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
