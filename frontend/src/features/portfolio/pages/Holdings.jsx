import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioCard from '../components/PortfolioCard';
import { useAuth } from '../../auth/context/AuthContext';
import marketService from '../../market/services/marketService';
import portfolioService from '../services/portfolioService';
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
  HiOutlineCash,
  HiOutlineExclamationCircle,
  HiOutlineSortAscending
} from 'react-icons/hi';
import Tooltip from '../../../shared/components/Tooltip';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { ROUTES } from '../../../shared/constants/routes';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';

const Holdings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ stocks: [], credits: 0 });
  const [coinsData, setCoinsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState('');

  const fetchPortfolioData = useCallback(async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      setError('');
      const data = await portfolioService.getPortfolio();
      if (data.success) {
        setPortfolio(data.data);
        if (data.data.stocks.length > 0) {
          const marketData = await marketService.getCoinsByIds(data.data.stocks.map((stock) => stock.stockId));
          setCoinsData(marketData);
        } else {
          setCoinsData({});
        }
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to sync portfolio');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      fetchPortfolioData();
    }
  }, [fetchPortfolioData, user?.userId]);

  const calculateTotals = () => {
    let totalVal = 0;
    let totalInv = 0;
    portfolio.stocks.forEach(stock => {
      const coinData = coinsData[stock.stockId];
      const currentPrice = coinData?.currentPrice || 0;
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
      const currentPrice = coin?.currentPrice || 0;
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
      const valA = a.quantity * (dataA?.currentPrice || 0);
      const valB = b.quantity * (dataB?.currentPrice || 0);
      return valB - valA;
    }
    if (sortBy === 'profit-desc') {
      const valA = a.quantity * (dataA?.currentPrice || 0);
      const profitA = valA - a.total_amount;
      const valB = b.quantity * (dataB?.currentPrice || 0);
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
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold mb-1">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Holdings</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Holdings <Tooltip text="A detailed list of all your purchased assets" /></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="ent-card px-4 py-2 bg-[var(--bg-subtle)] flex flex-col items-end">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Net Equity</span>
            <span className="text-sm font-bold text-[var(--text-primary)] font-mono">{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Stats Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Invested', val: formatCurrency(totalInvested), color: 'text-[var(--text-secondary)]', icon: <HiOutlineCash /> },
          { label: 'Current Value', val: formatCurrency(totalValue), color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: <HiOutlineChartPie /> },
          { label: 'Profit / Loss', val: `${isProfit ? '+' : '-'}${formatCurrency(Math.abs(totalPL))}`, color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: isProfit ? <HiOutlineArrowSmUp /> : <HiOutlineArrowSmDown /> },
          { label: 'Total Return', val: formatPercentage(totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0), color: isProfit ? 'text-emerald-500' : 'text-rose-500', icon: <HiOutlineScale /> },
        ].map((stat, i) => (
          <motion.div variants={itemVariants} key={i} className="ent-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</p>
              <span className={`text-lg ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Holdings toolbar */}
      <div className="ent-card mb-8 overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent-primary)]">
                <HiOutlineSortAscending className="text-lg" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Sort holdings</p>
                <p className="text-xs text-[var(--text-muted)]">Choose how your assets are ordered</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Sort holdings">
              {[
                { value: 'name', label: 'Asset name' },
                { value: 'value-desc', label: 'Highest value' },
                { value: 'profit-desc', label: 'Best performance' },
              ].map((option) => {
                const isActive = sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    aria-pressed={isActive}
                    className={`rounded-md border px-3.5 py-2 text-left text-xs font-semibold transition-colors sm:text-center ${
                      isActive
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                        : 'border-[var(--border-base)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex w-full items-center gap-3 border-t border-[var(--border-base)] pt-4 xl:w-auto xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
          <button 
            onClick={handleExport}
            className="btn-ent-secondary flex-1 whitespace-nowrap px-3 py-2 text-xs xl:flex-none"
          >
            <HiOutlineDownload /> Export
          </button>
          <button onClick={() => navigate(ROUTES.market)} className="btn-ent-primary flex-1 whitespace-nowrap px-4 py-2 text-xs xl:flex-none">
            <HiOutlinePlus /> Add Coin
          </button>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 ui-skeleton" />)}
        </div>
      ) : error ? (
        <div className="ui-error-state">
          <HiOutlineExclamationCircle className="text-3xl" />
          <p className="font-semibold">Unable to load your holdings</p>
          <p className="max-w-md text-sm">{error}</p>
          <button type="button" onClick={fetchPortfolioData} className="btn-ent-secondary mt-2">Try again</button>
        </div>
      ) : portfolio.stocks.length === 0 ? (
        <div className="ent-card p-20 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
          <HiOutlineCollection className="text-5xl text-[var(--text-muted)] mb-6" />
          <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">No Holdings Yet</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">Your portfolio is currently empty. Start by buying some coins from the market.</p>
          <button onClick={() => navigate(ROUTES.market)} className="btn-ent-primary px-8 py-3">Explore Market</button>
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
