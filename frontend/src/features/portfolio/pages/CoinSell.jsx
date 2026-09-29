import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import marketService from '../../market/services/marketService';
import portfolioService from '../services/portfolioService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { formatCryptoQuantity, formatCurrency } from '../../../shared/utils/formatters';
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
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellAmount, setSellAmount] = useState('');
  const [selling, setSelling] = useState(false);
  const [quantity, setQuantity] = useState(location.state?.quantity || 0);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoadError('');
        const [coinData, portfolioData] = await Promise.all([
          marketService.getCoinById(coinId),
          portfolioService.getPortfolio(),
        ]);
        const holding = portfolioData.data?.stocks?.find((stock) => stock.stockId === coinId);
        setCoin(coinData);
        setQuantity(holding?.quantity || 0);
      } catch (err) {
        const message = getApiErrorMessage(err, 'Failed to load holding data');
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [coinId]);

  const availableValue = coin ? quantity * (coin.currentPrice || 0) : 0;

  const handleSell = async (e) => {
    e.preventDefault();
    const amt = parseFloat(sellAmount);
    if (!amt || amt <= 0) return toast.error('Enter a valid amount');
    if (amt > availableValue) return toast.error(`Maximum available: ${formatCurrency(availableValue, { maximumFractionDigits: 0 })}`);
    if (amt < 10) return toast.error('Minimum sell amount is ₹10');

    setSelling(true);
    try {
      const price = coin.currentPrice;
      const qty = amt / price;
      const res = await portfolioService.sellCoin(coin.id, qty);
      if (res.success) {
        toast.success('Successfully sold');
        navigate(ROUTES.dashboard);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Server error'));
    } finally {
      setSelling(false);
    }
  };

  if (loading) return <div className="page-container animate-pulse"><div className="h-10 w-48 ui-skeleton mb-8" /><div className="h-64 ui-skeleton" /></div>;
  if (!coin) return (
    <div className="page-container">
      <div className="ui-error-state">
        <p className="font-semibold">Unable to prepare this sale</p>
        <p className="text-sm">{loadError || 'The requested holding was not found.'}</p>
        <button type="button" onClick={() => navigate(ROUTES.holdings)} className="btn-ent-secondary mt-2">Back to holdings</button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="page-container"
    >
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1 text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold mb-4 hover:text-[var(--accent-primary)] transition-colors"
        >
          <HiOutlineChevronLeft /> Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="ent-card overflow-hidden">
          <div className="px-8 py-6 border-b border-[var(--border-base)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              {coin.image && <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-sm" />}
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Sell {coin.name}</h1>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{coin.symbol?.toUpperCase()} Portfolio</p>
              </div>
            </div>
            <div className="p-2 rounded-full bg-rose-500/10 text-rose-500 text-xl">
              <HiOutlineTrendingDown />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="ent-card p-5 bg-[var(--bg-subtle)] border-dashed">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Current Price</p>
                <p className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatCurrency(coin.currentPrice)}</p>
              </div>
              <div className="ent-card p-5 bg-rose-500/5 border-rose-500/10 border-dashed">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <HiOutlineShieldExclamation /> Max to Sell
                </p>
                <p className="text-lg font-bold text-rose-500 font-mono">{formatCurrency(availableValue, { maximumFractionDigits: 0 })}</p>
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">{formatCryptoQuantity(quantity)} {coin.symbol?.toUpperCase()} available</p>
              </div>
            </div>

            <form onSubmit={handleSell} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Amount to Sell (INR)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">₹</span>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="ent-input pl-8 py-3"
                    min="10"
                    max={availableValue}
                    step="any"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[25, 50, 100].map((percentage) => (
                    <button
                      key={percentage}
                      type="button"
                      onClick={() => setSellAmount(((availableValue * percentage) / 100).toFixed(2))}
                      disabled={availableValue <= 0}
                      className="btn-ent-secondary px-3 py-1 text-[10px]"
                    >
                      {percentage === 100 ? 'Max' : `${percentage}%`}
                    </button>
                  ))}
                </div>
                {sellAmount && coin.currentPrice && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex justify-between text-xs"
                  >
                    <span className="text-[var(--text-muted)]">Estimated Units:</span>
                    <span className="font-bold text-[var(--text-primary)]">{formatCryptoQuantity(parseFloat(sellAmount) / coin.currentPrice)} {coin.symbol?.toUpperCase()}</span>
                  </motion.div>
                )}
                {quantity <= 0 && (
                  <p className="mt-3 text-xs font-medium text-[var(--negative)]">You do not currently own this asset.</p>
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
                  disabled={selling || quantity <= 0} 
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
