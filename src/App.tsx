import { Routes, Route, useLocation } from 'react-router-dom';
import { PageTitle } from './components/PageTitle';
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
        {!isAgencyPage && <Header />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<><PageTitle title="株式会社MetaHeroes | ヒーローと共創するメタバース・AIカンパニー" /><TopPage /></>} />
            
            {/* Agency Routes */}
            <Route path="/agency-login" element={<><PageTitle title="代理店ログイン | 株式会社MetaHeroes" /><LoginPage /></>} />
            <Route path="/agency" element={
              <ProtectedRoute>
                <AgencyLayout />
              </ProtectedRoute>
            }>
              <Route index element={<><PageTitle title="代理店ダッシュボード | 株式会社MetaHeroes" /><DashboardPage /></>} />
              <Route path="documents" element={<><PageTitle title="資料ライブラリ | 株式会社MetaHeroes" /><DocumentsPage /></>} />
              <Route path="videos" element={<><PageTitle title="動画ライブラリ | 株式会社MetaHeroes" /><VideosPage /></>} />
              <Route path="events" element={<><PageTitle title="イベント情報 | 株式会社MetaHeroes" /><EventsPage /></>} />
              <Route path="links" element={<><PageTitle title="関連リンク | 株式会社MetaHeroes" /><LinksPage /></>} />
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PageTitle title="管理者設定 | 株式会社MetaHeroes" />
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/company" element={<AboutCompanyPage />} />
            <Route path="/about/profile" element={<CompanyProfilePage />} />
            <Route path="/about/mission" element={<MissionPage />} />
            <Route path="/about/offices" element={<OfficesPage />} />
            <Route path="/about/conduct" element={<CodeOfConductPage />} />
            <Route path="/about/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/about/group" element={<GroupCompaniesPage />} />
            <Route path="/business" element={<BusinessContentPage />} />

            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact/privacy" element={<ContactPrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/document-request" element={<DocumentRequestPage />} />
            <Route path="/recruit" element={<RecruitPage />} />
            <Route path="/faq" element={<><PageTitle title="よくある質問 | 株式会社MetaHeroes" /><FAQPage /></>} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/xr" element={<XrSolutionsPage />} />
            <Route path="/services/holoshare" element={<HolosharePage />} />
            <Route path="/services/hero-aivo" element={<HeroAivoPage />} />
            <Route path="/services/ai-training" element={<AiTrainingPage />} />
            <Route path="/services/bousai-metaverse" element={<BousaiMetaversePage />} />
            <Route path="/services/bousai-expo" element={<BousaiExpoPage />} />
            <Route path="/services/hero-egg-collection" element={<HeroEggCollectionPage />} />
            <Route path="/services/hero-expo" element={<HeroExpoPage />} />
            <Route path="/services/global-hero-summit" element={<GlobalHeroSummitPage />} />
            <Route path="/services/egg-jam" element={<EggJamPage />} />
            <Route path="/services/ai-monday" element={<AiMondayPage />} />
            <Route path="/services/game-event" element={<GameEventPage />} />
            <Route path="/services/meta-heroes-guild" element={<MetaHeroesGuildPage />} />
            <Route path="/ceo-message" element={<CeoMessagePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/works" element={<WorksPage />} />
            <Route path="/members/blog" element={<MemberBlogPage />} />
            <Route path="/members" element={<MemberListPage />} />
            <Route path="/member/:memberId" element={<MemberPage />} />
            <Route path="/blog/:blogId" element={<BlogDetailPage />} />
            <Route path="/member-blog/:blogId" element={<BlogDetailPage />} />
          </Routes>
        </div>
        {!isAgencyPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
