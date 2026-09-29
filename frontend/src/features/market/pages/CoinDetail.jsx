import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import marketService from '../services/marketService';
import portfolioService from '../../portfolio/services/portfolioService';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/context/AuthContext';
import { motion } from 'framer-motion';
import PriceChart from '../components/PriceChart';
import Tooltip from '../../../shared/components/Tooltip';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import {
  formatCryptoQuantity,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '../../../shared/utils/formatters';
import { 
  HiOutlineChevronLeft, 
  HiOutlineShieldCheck,
  HiOutlineDatabase,
  HiOutlineChartSquareBar,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineSwitchHorizontal
} from 'react-icons/hi';

const CoinDetail = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [buyMode, setBuyMode] = useState('INR'); // 'INR' or 'QTY'
  const [buying, setBuying] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError('');
        
        // Use separate try-catches or handled promises to avoid one failure blocking everything
        const coinPromise = marketService.getCoinById(coinId).catch(err => {
          console.error("Coin Detail fetch error:", err);
          return null;
        });
        
        const historyPromise = marketService.getCoinHistory(coinId, 7).catch(err => {
          console.error("History fetch error:", err);
          return null;
        });

        const portfolioPromise = isAuthenticated
          ? portfolioService.getPortfolio().catch(() => null)
          : Promise.resolve(null);

        const [coinData, historyData, portfolioData] = await Promise.all([coinPromise, historyPromise, portfolioPromise]);
        
        if (!coinData) {
          throw new Error("Could not retrieve coin details. Please try again later.");
        }

        setCoin(coinData);
        setHistory(historyData?.prices || []);
        if (portfolioData?.success) setAvailableCredits(portfolioData.data.credits);
      } catch (err) {
        const message = getApiErrorMessage(err, 'Failed to load coin data');
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coinId, isAuthenticated]);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in first'); return navigate(ROUTES.login); }
    
    const amountToCharge = buyMode === 'INR' ? parseFloat(buyAmount) : parseFloat(buyQty) * coin.currentPrice;
    const qtyToBuy = buyMode === 'QTY' ? parseFloat(buyQty) : parseFloat(buyAmount) / coin.currentPrice;

    if (!amountToCharge || amountToCharge <= 0) { return toast.error('Enter a valid amount'); }
    if (availableCredits !== null && amountToCharge > availableCredits) {
      return toast.error(`You only have ${formatCurrency(availableCredits)} available`);
    }
    
    setBuying(true);
    try {
      const res = await portfolioService.buyCoin(coin.id, qtyToBuy);
      if (res.success) { 
        toast.success('Successfully bought'); 
        navigate(ROUTES.dashboard); 
      }
    } catch (err) { 
      toast.error(getApiErrorMessage(err, 'Insufficient credits or network error'));
    }
    finally { setBuying(false); }
  };

  const syncInputs = (val, mode) => {
    const price = coin.currentPrice;
    if (mode === 'INR') {
      setBuyAmount(val);
      setBuyQty(val ? (parseFloat(val) / price).toFixed(6) : '');
    } else {
      setBuyQty(val);
      setBuyAmount(val ? (parseFloat(val) * price).toFixed(2) : '');
    }
  };

  if (loading) return <div className="page-container animate-pulse"><div className="h-10 w-48 ui-skeleton mb-8" /><div className="h-96 ui-skeleton" /></div>;
  if (!coin) return (
    <div className="page-container">
      <div className="ui-error-state">
        <p className="font-semibold">Coin data could not be loaded</p>
        <p className="text-sm">{loadError || 'The requested coin may be unavailable.'}</p>
        <button type="button" onClick={() => navigate(ROUTES.market)} className="btn-ent-secondary mt-2">Back to market</button>
      </div>
    </div>
  );

  const pcs = [
    { l:'1h', v: coin.change1h },
    { l:'24h', v: coin.change24h },
    { l:'7d', v: coin.change7d },
    { l:'30d', v: coin.change30d },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4 hover:text-[var(--accent-primary)] transition-colors"
        >
          <HiOutlineChevronLeft /> Back
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {coin.image && <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full shadow-md" />}
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{coin.name} <span className="text-[var(--text-muted)] font-medium uppercase text-lg ml-1">{coin.symbol}</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="ui-badge uppercase">Rank #{coin.rank}</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <HiOutlineShieldCheck /> Verified Coin
                </span>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Current Price</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">{formatCurrency(coin.currentPrice)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Chart Section */}
          <div className="ent-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">7-Day Price Trend</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase tracking-widest">
                Live Data
              </div>
            </div>
            <PriceChart data={history} />
          </div>

          {/* Buy Section */}
          <div className="ent-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Buy {coin.name}</h2>
                {availableCredits !== null && (
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Available cash: <strong className="text-[var(--text-primary)]">{formatCurrency(availableCredits)}</strong></p>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setBuyMode(buyMode === 'INR' ? 'QTY' : 'INR')}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider hover:underline"
              >
                <HiOutlineSwitchHorizontal /> Switch to {buyMode === 'INR' ? coin.symbol?.toUpperCase() : 'INR'}
              </button>
            </div>
            <form onSubmit={handleBuy} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">
                  {buyMode === 'INR' ? '₹' : coin.symbol?.toUpperCase()}
                </span>
                <input 
                  type="number" 
                  step="any"
                  value={buyMode === 'INR' ? buyAmount : buyQty} 
                  onChange={(e) => syncInputs(e.target.value, buyMode)} 
                  placeholder={buyMode === 'INR' ? "Amount in INR..." : `Quantity in ${coin.symbol?.toUpperCase()}...`}
                  className="ent-input pl-12 py-3" 
                  min="0"
                  max={buyMode === 'INR' && availableCredits !== null ? availableCredits : undefined}
                />
              </div>
              <button type="submit" disabled={buying} className="btn-ent-primary px-10 py-3 shadow-lg shadow-blue-500/20">
                {buying ? 'Buying...' : 'Buy'}
              </button>
            </form>
            {(buyAmount || buyQty) && coin.currentPrice && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-[var(--bg-subtle)] rounded-lg flex items-center justify-between"
              >
                <span className="text-xs text-[var(--text-muted)]">
                  {buyMode === 'INR' ? 'Estimated Quantity:' : 'Estimated Cost:'}
                </span>
                <span className="text-sm font-bold font-mono text-[var(--accent-primary)]">
                  {buyMode === 'INR' 
                    ? `${formatCryptoQuantity(parseFloat(buyAmount) / coin.currentPrice)} ${coin.symbol?.toUpperCase()}`
                    : formatCurrency(buyAmount)
                  }
                </span>
              </motion.div>
            )}
            {buyAmount && availableCredits !== null && Number(buyAmount) > availableCredits && (
              <p className="mt-3 text-xs font-medium text-[var(--negative)]">This order exceeds your available cash.</p>
            )}
          </div>

          {/* Stats Table */}
          <div className="ent-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-base)] bg-[var(--bg-subtle)] flex items-center gap-2">
              <HiOutlineChartSquareBar className="text-[var(--text-muted)]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Market Stats</h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { l: 'All-Time High', v: formatCurrency(coin.allTimeHigh), icon: <HiOutlineArrowSmUp className="text-emerald-500" /> },
                { l: 'All-Time Low', v: formatCurrency(coin.allTimeLow), icon: <HiOutlineArrowSmDown className="text-rose-500" /> },
                { l: 'Market Cap', v: coin.marketCap ? `₹${formatNumber(coin.marketCap / 10000000, { maximumFractionDigits: 1 })} Cr` : '—', tooltip: 'Total value of all coins in circulation.' },
                { l: '24h Volume', v: coin.volume ? `₹${formatNumber(coin.volume / 10000000, { maximumFractionDigits: 1 })} Cr` : '—', tooltip: 'Total trading activity in the last 24 hours.' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">
                    {stat.l}
                    {stat.tooltip && <Tooltip text={stat.tooltip} />}
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)] font-mono flex items-center gap-1">{stat.v}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[var(--border-base)] grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--bg-subtle)]">
              {pcs.map((p) => (
                <div key={p.l} className="text-center">
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-1">{p.l} Change</p>
                  <p className={`text-xs font-bold ${p.v >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatPercentage(p.v, { maximumFractionDigits: 1 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-8">
          <div className="ent-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <HiOutlineDatabase /> Coin data
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Market data is provided by CoinStats and refreshed regularly.
            </p>
            {coin.websiteUrl && (
              <a
                href={coin.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-xs font-bold text-[var(--accent-primary)] hover:underline"
              >
                Visit official website
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinDetail;
