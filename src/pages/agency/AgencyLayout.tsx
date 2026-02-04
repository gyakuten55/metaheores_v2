import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  Link2,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgencyLayout: React.FC = () => {
  const { profile, signOut, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/agency-login');
  };

  const navItems = [
    { 
      label: 'ダッシュボード', 
      path: '/agency', 
      icon: LayoutDashboard,
      roles: ['admin', 'agent', 'guest']
    },
    { 
      label: '資料一覧', 
      path: '/agency/documents', 
      icon: FileText,
      roles: ['admin', 'agent', 'guest']
    },
    { 
      label: '動画一覧', 
      path: '/agency/videos', 
      icon: Video,
      roles: ['admin', 'agent', 'guest']
    },
    { 
      label: 'イベント情報', 
      path: '/agency/events', 
      icon: Calendar,
      roles: ['admin', 'agent']
    },
    { 
      label: '関連リンク', 
      path: '/agency/links', 
      icon: Link2,
      roles: ['admin', 'agent', 'guest']
    },
    { 
      label: '管理者設定', 
      path: '/agency/admin', 
      icon: Settings,
      roles: ['admin']
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    role && item.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Area */}
        <div className={`h-16 flex items-center border-b border-slate-100 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
          {isSidebarOpen && (
            <div className="flex items-center">
              <img src="/assets/MH.png" alt="Meta Heroes" className="h-8 w-auto" />
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hidden lg:block"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Info (Collapsed vs Expanded) */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-slate-100">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {profile?.company_name || profile?.full_name || 'User'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                  role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  role === 'agent' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {role === 'admin' ? '管理者' : role === 'agent' ? '代理店' : 'ゲスト'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                {isSidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="font-medium text-sm">ログアウト</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              <Menu size={20} />
            </button>
            <img src="/assets/MH.png" alt="Meta Heroes" className="h-6 w-auto" />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;