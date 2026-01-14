import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful:', data.user);
        navigate('/agency'); 
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('ログインに失敗しました。IDまたはパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-inter">
      {/* 背景装飾 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10 border border-slate-100"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Back to Top
        </Link>

        <div className="text-center mb-8">
          <img 
            src="/assets/MH.png" 
            alt="Meta Heroes" 
            className="h-16 sm:h-20 w-auto mx-auto mb-6 transition-transform hover:scale-105 duration-300" 
          />
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Sales Portal</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">MetaHeroes セールスポータル</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-800 text-sm"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-800 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-sm tracking-widest"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">or</span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            try {
              const { error } = await supabase.auth.signInWithPassword({
                email: 'guest@meta-heroes.co.jp',
                password: 'GuestHero2026',
              });
              if (error) throw error;
              navigate('/agency');
            } catch (err) {
              console.error('Guest login error:', err);
              setError('ゲストログインに失敗しました。');
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-500 font-bold py-3 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-xs tracking-widest uppercase"
        >
          <User size={16} />
          Guest Access (View Only)
        </button>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            ※ アカウントをお持ちでない場合は、担当営業までお問い合わせください。
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;