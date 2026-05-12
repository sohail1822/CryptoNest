import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cryptoService from '../services/cryptoService';
import PortfolioCard from '../Components/PortfolioCard';
import AllocationChart from '../Components/AllocationChart';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  HiOutlineCash, 
  HiOutlinePresentationChartLine, 
  HiOutlineTrendingUp,
  HiOutlineRefresh,
  HiOutlineCube,
  HiOutlineArrowRight
} from 'react-icons/hi';
import Tooltip from '../Components/Tooltip';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ stocks: [], credits: 0 });
  const [coinDataMap, setCoinDataMap] = useState({});
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState({ globalCap: 'Loading...', btcDominance: 'Loading...', sentiment: 'Loading...' });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        // Fetch Portfolio and Market Data in parallel
        const [pData, globalData, sentimentData] = await Promise.all([
          cryptoService.getPortfolio(user.userId),
          cryptoService.getGlobalData(),
          cryptoService.getMarketSentiment()
        ]);

        if (pData.success) {
          setPortfolio(pData.data);
          const coinIds = pData.data.stocks.map(s => s.stockId).join(',');
          if (coinIds) {
            const batchData = await cryptoService.fetchCoinData(coinIds);
            setCoinDataMap(batchData);
            
            let totalVal = 0;
            const allocation = [];
            pData.data.stocks.forEach(stock => {
              const currentPrice = batchData[stock.stockId]?.current_price || 0;
              const value = stock.quantity * currentPrice;
              totalVal += value;
              allocation.push({ name: batchData[stock.stockId]?.name || stock.stockId, value });
            });
            setTotalCurrent(totalVal);
            setChartData(allocation.sort((a, b) => b.value - a.value));
          }
        }

        if (globalData?.data) {
          const cap = globalData.data.total_market_cap?.inr || 0;
          const dom = globalData.data.market_cap_percentage?.btc || 0;
          setMarketStats(prev => ({ 
            ...prev, 
            globalCap: `₹${(cap / 1e12).toFixed(1)}T`, 
            btcDominance: `${dom.toFixed(1)}%` 
          }));
        }

        if (sentimentData?.data?.[0]) {
          setMarketStats(prev => ({ 
            ...prev, 
            sentiment: `${sentimentData.data[0].value} / 100`,
            sentimentText: sentimentData.data[0].value_classification
          }));
        }
      } catch (err) {
        toast.error('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [user?.userId]);

  const totalInvested = 1000000 - portfolio.credits;
  const profitLoss = totalCurrent - totalInvested;
  const profitPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;
  const isProfit = profitLoss >= 0;

  if (loading) {
    return (
      <div className="page-container flex flex-col gap-8 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />)}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const isPro = (user?.subscription || '').toLowerCase() === 'pro' || (user?.subscription || '').toLowerCase() === 'elite';

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Portfolio Overview <Tooltip text="Your overall portfolio performance and market insights" /></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded border border-[var(--border-base)]">
            <motion.span 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-emerald-500" 
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">System Ready</span>
          </div>
          <button onClick={() => window.location.reload()} className="btn-ent-secondary py-1.5 px-3 text-xs flex items-center gap-2">
            <HiOutlineRefresh /> <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Available Capital', value: `₹${portfolio.credits.toLocaleString()}`, sub: 'Cash Balance', icon: <HiOutlineCash /> },
          { label: 'Total Equity', value: `₹${totalCurrent.toLocaleString()}`, sub: `${portfolio.stocks.length} Coins`, icon: <HiOutlinePresentationChartLine /> },
          { label: 'Total Profit/Loss', value: `₹${Math.abs(profitLoss).toLocaleString()}`, sub: `${profitPercent}% Return`, icon: <HiOutlineTrendingUp />, isPL: true },
        ].map((stat, i) => (
          <motion.div 
            variants={itemVariants} 
            key={i} 
            className={`ent-card p-5 flex items-start justify-between transition-all duration-500 ${isPro ? 'border-[var(--accent-primary)]/40 bg-gradient-to-br from-[var(--bg-card)] to-[var(--accent-primary)]/5 shadow-md shadow-[var(--accent-primary)]/5' : ''}`}
          >
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-3">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-1">{stat.value}</h3>
              <p className={`text-xs font-medium ${stat.isPL ? (isProfit ? 'text-emerald-500' : 'text-rose-500') : 'text-[var(--text-secondary)]'}`}>
                {stat.isPL && (isProfit ? '+' : '-')} {stat.sub}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border transition-colors ${isPro ? 'bg-[var(--accent-primary)] text-white border-transparent' : 'bg-gray-50 dark:bg-gray-800/50 border-[var(--border-base)] text-[var(--accent-primary)]'}`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Current Holdings</h2>
            <a href="/holdings" className="text-[var(--accent-primary)] text-xs font-bold hover:underline flex items-center gap-1">
              View All <HiOutlineArrowRight />
            </a>
          </div>

          {portfolio.stocks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {portfolio.stocks.map((stock) => (
                <PortfolioCard
                  key={stock.stockId}
                  stock={stock}
                  coinData={coinDataMap[stock.stockId]}
                />
              ))}
            </div>
          ) : (
            <div className="ent-card p-12 text-center border-dashed border-2 flex flex-col items-center justify-center bg-transparent">
              <HiOutlineCube className="text-4xl text-gray-300 mb-4" />
              <p className="text-[var(--text-muted)] font-medium mb-4">No active holdings found.</p>
              <a href="/market" className="btn-ent-primary px-6">Explore Market</a>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="ent-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-base)] bg-gray-50 dark:bg-gray-800/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Asset Distribution</h3>
            </div>
            <div className="p-5">
              {chartData.length > 0 ? (
                <AllocationChart data={chartData} />
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-400 text-xs italic">
                  No data to display
                </div>
              )}
            </div>
          </div>

          <div className="ent-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-base)] bg-gray-50 dark:bg-gray-800/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Market Insights</h3>
            </div>
            <div className="p-5 space-y-4">
              {[
                { title: 'Global Market Cap', val: marketStats.globalCap, trend: '24h Live' },
                { title: 'BTC Dominance', val: marketStats.btcDominance, trend: 'Market Weight' },
                { title: 'Fear & Greed Index', val: marketStats.sentiment, trend: marketStats.sentimentText || 'Sentiment' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{item.title}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{item.val}</p>
                    <p className="text-[10px] font-bold text-[var(--text-muted)]">{item.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`ent-card p-5 text-white border-none shadow-lg ${
            (user?.subscription || '').toLowerCase() === 'elite' ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20' :
            (user?.subscription || '').toLowerCase() === 'pro' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' :
            'bg-gradient-to-br from-[var(--accent-primary)] to-indigo-600'
          }`}>
            <h3 className="font-bold mb-2">
              {((user?.subscription || '').toLowerCase() === 'pro' || (user?.subscription || '').toLowerCase() === 'elite') ? 'Intelligence Ready' : 'Premium Analytics'}
            </h3>
            <p className="text-xs opacity-90 mb-4 leading-relaxed">
              {((user?.subscription || '').toLowerCase() === 'pro' || (user?.subscription || '').toLowerCase() === 'elite') 
                ? 'Your institutional-grade analytics and AI signals are now active in the Intelligence Terminal.'
                : 'Upgrade your account for professional charts and institutional-grade portfolio metrics.'}
            </p>
            <button 
              onClick={() => window.location.href = '/intelligence'}
              className="w-full py-2 bg-white text-[var(--accent-primary)] rounded font-bold text-xs hover:bg-opacity-90 transition-all"
            >
              {((user?.subscription || '').toLowerCase() === 'pro' || (user?.subscription || '').toLowerCase() === 'elite') ? 'Go to Intelligence' : 'Explore Pro'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
