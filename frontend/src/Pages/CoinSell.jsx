import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import cryptoService from '../services/cryptoService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  HiOutlineChevronLeft, 
  HiOutlineTrendingDown,
  HiOutlineCash,
  HiOutlineShieldExclamation
} from 'react-icons/hi';

const CoinSell = () => {
  const { coinId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellAmount, setSellAmount] = useState('');
  const [selling, setSelling] = useState(false);
  const [quantity] = useState(location.state?.quantity || 0);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await cryptoService.getCoinById(coinId);
        setCoin(data);
      } catch (err) {
        toast.error('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [coinId]);

  const availableValue = coin ? quantity * (coin.market_data?.current_price?.inr || 0) : 0;

  const handleSell = async (e) => {
    e.preventDefault();
    const amt = parseFloat(sellAmount);
    if (!amt || amt <= 0) return toast.error('Enter a valid amount');
    if (amt > availableValue) return toast.error(`Maximum available: ₹${availableValue.toFixed(0)}`);
    if (amt < 10) return toast.error('Minimum sell amount is ₹10');

    setSelling(true);
    try {
      const price = coin.market_data?.current_price?.inr;
      const qty = amt / price;
      const res = await cryptoService.sellStock(user.userId, coin.id, qty, amt);
      if (res.success) {
        toast.success('Successfully sold');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Server error';
      toast.error(message);
    } finally {
      setSelling(false);
    }
  };

  if (loading) return <div className="page-container animate-pulse"><div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded mb-8" /><div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg" /></div>;
  if (!coin) return <div className="page-container text-center py-20 text-gray-500">Coin not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="page-container"
    >
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-widest font-bold mb-4 hover:text-[var(--accent-primary)] transition-colors"
        >
          <HiOutlineChevronLeft /> Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="ent-card overflow-hidden">
          <div className="px-8 py-6 border-b border-[var(--border-base)] bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {coin.image && <img src={coin.image.small} alt={coin.name} className="w-10 h-10 rounded-full shadow-sm" />}
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Sell {coin.name}</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{coin.symbol?.toUpperCase()} Portfolio</p>
              </div>
            </div>
            <div className="p-2 rounded-full bg-rose-500/10 text-rose-500 text-xl">
              <HiOutlineTrendingDown />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="ent-card p-5 bg-gray-50 dark:bg-gray-800/20 border-dashed">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
                <p className="text-lg font-bold text-[var(--text-primary)] font-mono">₹{coin.market_data?.current_price?.inr?.toLocaleString()}</p>
              </div>
              <div className="ent-card p-5 bg-rose-500/5 border-rose-500/10 border-dashed">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <HiOutlineShieldExclamation /> Max to Sell
                </p>
                <p className="text-lg font-bold text-rose-500 font-mono">₹{Math.floor(availableValue).toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleSell} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Amount to Sell (INR)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-[var(--accent-primary)] transition-colors">₹</span>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="ent-input pl-8 py-3"
                  />
                </div>
                {sellAmount && coin.market_data?.current_price?.inr && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex justify-between text-xs"
                  >
                    <span className="text-gray-400">Estimated Units:</span>
                    <span className="font-bold text-[var(--text-primary)]">{(parseFloat(sellAmount) / coin.market_data.current_price.inr).toFixed(6)} {coin.symbol?.toUpperCase()}</span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="btn-ent-secondary px-8 flex items-center gap-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={selling} 
                  className="flex-1 py-3 bg-rose-600 text-white rounded-md font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {selling ? 'Selling...' : <><HiOutlineCash className="text-lg" /> Confirm Sell</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinSell;
