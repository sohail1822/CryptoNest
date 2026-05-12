import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioCard from '../Components/PortfolioCard';
import { useAuth } from '../context/AuthContext';
import cryptoService, { fetchCoinData } from '../services/cryptoService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  HiOutlineDownload, 
  HiOutlinePlus,
  HiOutlineChartPie,
  HiOutlineCollection,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineScale,
  HiOutlineCash
} from 'react-icons/hi';
import Tooltip from '../Components/Tooltip';

const Holdings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ stocks: [], credits: 0 });
  const [coinsData, setCoinsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (user?.userId) {
      fetchPortfolioData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const data = await cryptoService.getPortfolio(user.userId);
      if (data.success) {
        setPortfolio(data.data);
        if (data.data.stocks.length > 0) {
          fetchAllCoinsData(data.data.stocks);
        } else {
          setCoinsData({});
        }
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      toast.error('Failed to sync portfolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoinsData = async (stocks) => {
    try {
      const coinIds = stocks.map((stock) => stock.stockId).join(',');
      if (!coinIds) {
        setCoinsData({});
        return;
      }
      const data = await fetchCoinData(coinIds);
      setCoinsData(data);
    } catch (error) {
      console.error('Market data sync failed:', error);
    }
  };

  const calculateTotals = () => {
    let totalVal = 0;
    let totalInv = 0;
    portfolio.stocks.forEach(stock => {
      const coinData = coinsData[stock.stockId];
      const currentPrice = coinData?.current_price || 0;
      totalVal += stock.quantity * currentPrice;
      totalInv += stock.total_amount;
    });
    return { totalValue: totalVal, totalInvested: totalInv };
  };

  const { totalValue, totalInvested } = calculateTotals();
  const totalPL = totalValue - totalInvested;
  const isProfit = totalPL >= 0;

  const handleExport = () => {
    if (portfolio.stocks.length === 0) return toast.info('No holdings to export');
    
    const headers = ['Asset', 'Symbol', 'Quantity', 'Avg Price', 'Current Price', 'Total Invested', 'Current Value', 'P/L'];
    const rows = portfolio.stocks.map(stock => {
      const coin = coinsData[stock.stockId];
      const currentPrice = coin?.current_price || 0;
      const currentValue = stock.quantity * currentPrice;
      const pl = currentValue - stock.total_amount;
      return [
        coin?.name || stock.stockId,
        coin?.symbol?.toUpperCase() || '',
        stock.quantity,
        (stock.total_amount / stock.quantity).toFixed(2),
        currentPrice,
        stock.total_amount.toFixed(2),
        currentValue.toFixed(2),
        pl.toFixed(2)
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cryptonest_holdings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Portfolio exported successfully');
  };

  const sortedStocks = [...portfolio.stocks].sort((a, b) => {
    const dataA = coinsData[a.stockId];
    const dataB = coinsData[b.stockId];
    
    if (sortBy === 'name') {
      return (dataA?.name || a.stockId).localeCompare(dataB?.name || b.stockId);
    }
    if (sortBy === 'value-desc') {
      const valA = a.quantity * (dataA?.current_price || 0);
      const valB = b.quantity * (dataB?.current_price || 0);
      return valB - valA;
    }
    if (sortBy === 'profit-desc') {
      const valA = a.quantity * (dataA?.current_price || 0);
      const profitA = valA - a.total_amount;
      const valB = b.quantity * (dataB?.current_price || 0);
      const profitB = valB - b.total_amount;
      return profitB - profitA;
    }
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Holdings</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Holdings <Tooltip text="A detailed list of all your purchased assets" /></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="ent-card px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Equity</span>
            <span className="text-sm font-bold text-[var(--text-primary)] font-mono">₹{totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Invested', val: `₹${totalInvested.toLocaleString()}`, color: 'text-gray-500', icon: <HiOutlineCash /> },
          { label: 'Current Value', val: `₹${totalValue.toLocaleString()}`, color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: <HiOutlineChartPie /> },
          { label: 'Profit / Loss', val: `${isProfit ? '+' : '-'}₹${Math.abs(totalPL).toLocaleString()}`, color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: isProfit ? <HiOutlineArrowSmUp /> : <HiOutlineArrowSmDown /> },
          { label: 'Total Return', val: `${totalInvested > 0 ? ((totalPL/totalInvested)*100).toFixed(2) : 0}%`, color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: <HiOutlineScale /> },
        ].map((stat, i) => (
          <motion.div variants={itemVariants} key={i} className="ent-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <span className={`text-lg ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="ent-card p-4 mb-8 bg-gray-50 dark:bg-gray-800/20 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <HiOutlineCollection className="text-sm" /> Filter
          </span>
          <div className="h-4 w-px bg-[var(--border-base)] hidden md:block" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="ent-select text-xs font-bold"
          >
            <option value="name">Asset Name</option>
            <option value="value-desc">Highest Value</option>
            <option value="profit-desc">Best Performance</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="btn-ent-secondary py-1.5 px-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
          >
            <HiOutlineDownload /> Export
          </button>
          <button onClick={() => navigate('/market')} className="btn-ent-primary py-1.5 px-4 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
            <HiOutlinePlus /> Add Coin
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
        </div>
      ) : portfolio.stocks.length === 0 ? (
        <div className="ent-card p-20 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
          <HiOutlineCollection className="text-5xl text-gray-300 mb-6" />
          <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">No Holdings Yet</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">Your portfolio is currently empty. Start by buying some coins from the market.</p>
          <button onClick={() => navigate('/market')} className="btn-ent-primary px-8 py-3">Explore Market</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedStocks.map((stock) => (
            <motion.div variants={itemVariants} key={stock.stockId}>
              <PortfolioCard
                stock={stock}
                coinData={coinsData[stock.stockId]}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Holdings;
