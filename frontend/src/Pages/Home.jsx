import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import cryptoService from '../services/cryptoService';
import { motion } from 'framer-motion';
import { 
  HiOutlineChartBar, 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [trendingCoins, setTrendingCoins] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await cryptoService.getCoins(1, 4);
        setTrendingCoins(data);
      } catch (err) {
        console.error('Failed to load coins:', err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300">
      {/* Header */}
      <nav className="border-b border-[var(--border-base)] bg-white/80 dark:bg-black/20 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold shadow-sm">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">CryptoNest</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="text-xl hover:opacity-70 transition-opacity p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ent-primary px-6">
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]">Sign In</Link>
                <Link to="/signup" className="btn-ent-primary px-6">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 border-b border-[var(--border-base)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 dark:bg-blue-900/5 -z-10 skew-x-[-15deg] translate-x-24" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Professional Portfolio Manager
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[var(--text-primary)] tracking-tighter leading-[1.05] mb-8">
              The Best Way to <br />
              <span className="text-[var(--accent-primary)]">Track Crypto.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] font-medium leading-relaxed mb-10 max-w-xl">
              Manage your digital assets with a simple, professional interface. Track real-time prices, analyze trends, and practice trading with zero risk.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-ent-primary px-10 py-4 text-base shadow-xl shadow-blue-500/20">
                Join Now Free
              </Link>
              <Link to="/market" className="btn-ent-secondary px-10 py-4 text-base">
                Explore Market
              </Link>
            </div>
          </motion.div>

          {/* Visual Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="ent-card bg-white dark:bg-[#0d1117] shadow-2xl p-6 rotate-1">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-base)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Live Market Feed</div>
              </div>
              
              <div className="space-y-6">
                {trendingCoins.length > 0 ? trendingCoins.slice(0, 3).map((coin, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-bold">{coin.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold">₹{coin.current_price.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )) : [1, 2, 3].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
              
              <div className="mt-8 h-24 w-full bg-blue-50 dark:bg-blue-900/10 rounded flex items-end gap-1 p-2">
                {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-[var(--accent-primary)] opacity-40 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 ent-card p-4 bg-white dark:bg-[#161b22] shadow-xl max-w-[200px]"
            >
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Virtual Balance</p>
              <p className="text-xl font-bold text-emerald-500 font-mono">₹1,000,000</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4">Core Features</h2>
              <p className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">Professional tools made simple.</p>
            </div>
            <p className="text-[var(--text-secondary)] font-medium max-w-sm">Built for everyone who wants to learn crypto trading and manage their portfolio with ease.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { t: 'Live Market Data', d: 'Get real-time pricing data and market trends for over 10,000+ cryptocurrencies.', icon: <HiOutlineChartBar /> },
              { t: 'Virtual Trading', d: 'Practice your trading strategies with ₹10 Lakhs of virtual credits with zero risk.', icon: <HiOutlineLightningBolt /> },
              { t: 'Secure Portfolio', d: 'Keep track of all your holdings and performance metrics in one secure place.', icon: <HiOutlineShieldCheck /> },
            ].map((f, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="group p-6 rounded-xl border border-transparent hover:border-[var(--border-base)] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
              >
                <div className="text-4xl mb-6 text-[var(--accent-primary)]">{f.icon}</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{f.t}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-[var(--border-base)] bg-gray-50 dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-sm">C</div>
              <span className="font-bold text-lg text-[var(--text-primary)]">CryptoNest</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">The simplest way to manage your crypto portfolio and learn trading strategies.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">App</h4>
            <ul className="space-y-4 text-sm text-[var(--text-muted)] font-medium">
              <li><Link to="/market" className="hover:text-[var(--accent-primary)] transition-colors">Market</Link></li>
              <li><Link to="/news" className="hover:text-[var(--accent-primary)] transition-colors">News</Link></li>
              <li><Link to="/dashboard" className="hover:text-[var(--accent-primary)] transition-colors">Overview</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--text-muted)] font-medium">
              <li><Link to="/about" className="hover:text-[var(--accent-primary)] transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--accent-primary)] transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--accent-primary)] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--border-base)]">
          <p className="text-xs text-[var(--text-muted)] font-medium">© {new Date().getFullYear()} CryptoNest. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Market Status: Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
