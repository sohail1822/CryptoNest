import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchCoinData } from '../services/cryptoService';
import { motion } from 'framer-motion';
import { 
  HiOutlineStar, 
  HiOutlineTrash,
  HiOutlineSearch
} from 'react-icons/hi';

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, loading: contextLoading } = useWatchlist();
  const [coinsData, setCoinsData] = useState({});
  const [loading, setLoading] = useState(true);

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
      const coinIds = watchlistIds.join(',');
      const data = await fetchCoinData(coinIds);
      setCoinsData(data);
    } catch (error) {
      console.error('Error fetching coins data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
          <span>Market</span>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Watchlist</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Watchlist</h1>
      </div>

      {loading || contextLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="ent-card p-20 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
          <HiOutlineStar className="text-5xl text-gray-300 mb-6" />
          <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Watchlist Empty</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">You haven't added any coins to your watchlist yet. Start tracking your favorite coins today.</p>
          <button onClick={() => navigate('/market')} className="btn-ent-primary px-8 py-3">Explore Market</button>
        </div>
      ) : (
        <div className="ent-card overflow-hidden">
          <table className="ent-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Current Price</th>
                <th>24h Change</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((coinId, index) => {
                const coin = coinsData[coinId];
                if (!coin) return null;
                return (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={coinId} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                    onClick={() => navigate(`/coin/${coinId}`)}
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
                    <td className="font-mono">₹{coin.current_price?.toLocaleString()}</td>
                    <td>
                      <div className={`font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
                      </div>
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coinId);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-md transition-colors inline-flex items-center gap-2 text-xs font-bold"
                      >
                        <HiOutlineTrash className="text-lg" /> Remove
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist;
