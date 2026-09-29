import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import marketService from '../../market/services/marketService';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { 
  HiOutlineStar, 
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, loading: contextLoading } = useWatchlist();
  const [coinsData, setCoinsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchAllCoinsData(watchlist);
    } else {
      setCoinsData({});
      setLoading(false);
    }
  }, [watchlist]);

  const fetchAllCoinsData = async (watchlistIds) => {
    try {
      setLoading(true);
      setError('');
      const coinIds = watchlistIds.join(',');
      const data = await marketService.getCoinsByIds(coinIds);
      setCoinsData(data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to load watchlist prices');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const filteredIds = watchlist.filter((coinId) => {
    const coin = coinsData[coinId];
    const query = search.trim().toLowerCase();
    return !query || coin?.name?.toLowerCase().includes(query) || coin?.symbol?.toLowerCase().includes(query);
  });

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
          <span>Market</span>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Watchlist</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Watchlist</h1>
        {watchlist.length > 0 && (
          <div className="relative w-full sm:w-72">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="ent-input pl-9" placeholder="Filter saved coins" />
          </div>
        )}
      </div>

      {loading || contextLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-20 ui-skeleton" />)}
        </div>
      ) : error ? (
        <div className="ui-error-state">
          <HiOutlineExclamationCircle className="text-3xl" />
          <p className="font-semibold">Unable to load watchlist prices</p>
          <p className="max-w-md text-sm">{error}</p>
          <button type="button" onClick={() => fetchAllCoinsData(watchlist)} className="btn-ent-secondary mt-2">Try again</button>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="ent-card p-20 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
          <HiOutlineStar className="text-5xl text-[var(--text-muted)] mb-6" />
          <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Watchlist Empty</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">You haven't added any coins to your watchlist yet. Start tracking your favorite coins today.</p>
          <button onClick={() => navigate(ROUTES.market)} className="btn-ent-primary px-8 py-3">Explore Market</button>
        </div>
      ) : filteredIds.length === 0 ? (
        <div className="ui-empty-state">
          <HiOutlineSearch className="text-3xl" />
          <p className="font-semibold">No saved coins match “{search}”</p>
          <button type="button" onClick={() => setSearch('')} className="btn-ent-secondary mt-2">Clear search</button>
        </div>
      ) : (
        <div className="ent-card overflow-hidden">
          <div className="overflow-x-auto"><table className="ent-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Current Price</th>
                <th>24h Change</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIds.map((coinId, index) => {
                const coin = coinsData[coinId];
                if (!coin) return null;
                return (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={coinId} 
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.coin(coinId))}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{coin.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono">{formatCurrency(coin.currentPrice)}</td>
                    <td>
                      <div className={`font-bold ${coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.change24h >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(coin.change24h))}
                      </div>
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coinId);
                        }}
                        className="p-2 text-[var(--negative)] hover:bg-[var(--negative-soft)] rounded-md transition-colors inline-flex items-center gap-2 text-xs font-bold"
                      >
                        <HiOutlineTrash className="text-lg" /> Remove
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table></div>
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist;
