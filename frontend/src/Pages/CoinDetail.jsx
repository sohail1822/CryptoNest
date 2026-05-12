import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cryptoService from '../services/cryptoService';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import PriceChart from '../Components/PriceChart';
import Tooltip from '../Components/Tooltip';
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
  const { user, isAuthenticated } = useAuth();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [buyMode, setBuyMode] = useState('INR'); // 'INR' or 'QTY'
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use separate try-catches or handled promises to avoid one failure blocking everything
        const coinPromise = cryptoService.getCoinById(coinId).catch(err => {
          console.error("Coin Detail fetch error:", err);
          return null;
        });
        
        const historyPromise = cryptoService.getCoinHistory(coinId, 7).catch(err => {
          console.error("History fetch error:", err);
          return null;
        });

        const [coinData, historyData] = await Promise.all([coinPromise, historyPromise]);
        
        if (!coinData) {
          throw new Error("Could not retrieve coin details. Please try again later.");
        }

        setCoin(coinData);
        setHistory(historyData?.prices || []);
      } catch (err) {
        console.error("Fetch Data Error:", err);
        toast.error(err.message || 'Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coinId]);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in first'); return navigate('/login'); }
    
    const amountToCharge = buyMode === 'INR' ? parseFloat(buyAmount) : parseFloat(buyQty) * coin.market_data?.current_price?.inr;
    const qtyToBuy = buyMode === 'QTY' ? parseFloat(buyQty) : parseFloat(buyAmount) / coin.market_data?.current_price?.inr;

    if (!amountToCharge || amountToCharge <= 0) { return toast.error('Enter a valid amount'); }
    
    setBuying(true);
    try {
      const res = await cryptoService.buyStock(user.userId, coin.id, qtyToBuy, amountToCharge);
      if (res.success) { 
        toast.success('Successfully bought'); 
        setTimeout(() => navigate('/dashboard'), 1000); 
      }
    } catch (err) { 
      const message = err.response?.data?.message || err.response?.data?.data?.message || 'Insufficient credits or network error';
      toast.error(message); 
    }
    finally { setBuying(false); }
  };

  const syncInputs = (val, mode) => {
    const price = coin.market_data?.current_price?.inr;
    if (mode === 'INR') {
      setBuyAmount(val);
      setBuyQty(val ? (parseFloat(val) / price).toFixed(6) : '');
    } else {
      setBuyQty(val);
      setBuyAmount(val ? (parseFloat(val) * price).toFixed(2) : '');
    }
  };

  if (loading) return <div className="page-container animate-pulse"><div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded mb-8" /><div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" /></div>;
  if (!coin) return <div className="page-container text-center py-20 text-gray-500">Coin not found.</div>;

  const pcs = [
    { l:'1h', v: coin.market_data?.price_change_percentage_1h_in_currency?.inr },
    { l:'24h', v: coin.market_data?.price_change_percentage_24h_in_currency?.inr },
    { l:'7d', v: coin.market_data?.price_change_percentage_7d_in_currency?.inr },
    { l:'30d', v: coin.market_data?.price_change_percentage_30d_in_currency?.inr },
    { l:'1y', v: coin.market_data?.price_change_percentage_1y_in_currency?.inr },
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
            {coin.image && <img src={coin.image.large} alt={coin.name} className="w-12 h-12 rounded-full shadow-md" />}
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{coin.name} <span className="text-gray-400 font-medium uppercase text-lg ml-1">{coin.symbol}</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-[var(--text-muted)] uppercase">Rank #{coin.market_cap_rank}</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <HiOutlineShieldCheck /> Verified Coin
                </span>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Current Price</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">₹{coin.market_data?.current_price?.inr?.toLocaleString()}</p>
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
              <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Buy {coin.name}</h2>
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  {buyMode === 'INR' ? '₹' : coin.symbol?.toUpperCase()}
                </span>
                <input 
                  type="number" 
                  step="any"
                  value={buyMode === 'INR' ? buyAmount : buyQty} 
                  onChange={(e) => syncInputs(e.target.value, buyMode)} 
                  placeholder={buyMode === 'INR' ? "Amount in INR..." : `Quantity in ${coin.symbol?.toUpperCase()}...`}
                  className="ent-input pl-12 py-3" 
                />
              </div>
              <button type="submit" disabled={buying} className="btn-ent-primary px-10 py-3 shadow-lg shadow-blue-500/20">
                {buying ? 'Buying...' : 'Buy'}
              </button>
            </form>
            {(buyAmount || buyQty) && coin.market_data?.current_price?.inr && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between"
              >
                <span className="text-xs text-[var(--text-muted)]">
                  {buyMode === 'INR' ? 'Estimated Quantity:' : 'Estimated Cost:'}
                </span>
                <span className="text-sm font-bold font-mono text-[var(--accent-primary)]">
                  {buyMode === 'INR' 
                    ? `${(parseFloat(buyAmount) / coin.market_data.current_price.inr).toFixed(6)} ${coin.symbol?.toUpperCase()}`
                    : `₹${parseFloat(buyAmount).toLocaleString()}`
                  }
                </span>
              </motion.div>
            )}
          </div>

          {/* Stats Table */}
          <div className="ent-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-base)] bg-gray-50 dark:bg-gray-800/30 flex items-center gap-2">
              <HiOutlineChartSquareBar className="text-[var(--text-muted)]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Market Stats</h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { l: '24h High', v: `₹${coin.market_data?.high_24h?.inr?.toLocaleString()}`, icon: <HiOutlineArrowSmUp className="text-emerald-500" /> },
                { l: '24h Low', v: `₹${coin.market_data?.low_24h?.inr?.toLocaleString()}`, icon: <HiOutlineArrowSmDown className="text-rose-500" /> },
                { l: 'Market Cap', v: `₹${(coin.market_data?.market_cap?.inr / 10000000)?.toFixed(1)} Cr`, tooltip: 'Total value of all coins in circulation.' },
                { l: '24h Volume', v: `₹${(coin.market_data?.total_volume?.inr / 10000000)?.toFixed(1)} Cr`, tooltip: 'Total trading activity in the last 24 hours.' },
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
            <div className="px-6 py-4 border-t border-[var(--border-base)] grid grid-cols-5 gap-2 bg-gray-50/30 dark:bg-black/10">
              {pcs.map((p) => (
                <div key={p.l} className="text-center">
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-1">{p.l} Change</p>
                  <p className={`text-xs font-bold ${p.v >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {p.v != null ? `${p.v.toFixed(1)}%` : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-8">
          <div className="ent-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6 flex items-center gap-2">
              <HiOutlineDatabase /> About {coin.name}
            </h3>
            <div 
              className="text-xs text-[var(--text-secondary)] leading-relaxed max-h-[500px] overflow-y-auto prose dark:prose-invert scrollbar-thin" 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(coin.description?.en || 'No description available.') }} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinDetail;
