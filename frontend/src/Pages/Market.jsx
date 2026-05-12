import React, { useState, useEffect } from 'react';
import cryptoService from '../services/cryptoService';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineAdjustments, 
  HiStar, 
  HiOutlineStar,
  HiOutlineArrowNarrowRight
} from 'react-icons/hi';

const Market = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('market_cap_rank'); // default
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const data = await cryptoService.getCoins(page, 50); // Increased to 50 for better filtering
        setCoins(data);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [page]);

  const sortedCoins = [...coins].sort((a, b) => {
    if (sortBy === 'price_desc') return b.current_price - a.current_price;
    if (sortBy === 'price_asc') return a.current_price - b.current_price;
    if (sortBy === 'change_desc') return b.price_change_percentage_24h - a.price_change_percentage_24h;
    if (sortBy === 'change_asc') return a.price_change_percentage_24h - b.price_change_percentage_24h;
    if (sortBy === 'market_cap_desc') return b.market_cap - a.market_cap;
    return a.market_cap_rank - b.market_cap_rank; // default rank
  });

  const filteredCoins = sortedCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
            <span>Live</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Market</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Market Coins</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group w-full md:w-80">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coins..."
              className="ent-input pl-10"
            />
          </div>
          <div className="relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-[var(--border-base)]">
            <HiOutlineAdjustments className="text-gray-400" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="ent-select"
            >
              <option value="market_cap_rank">Market Rank</option>
              <option value="market_cap_desc">Market Cap</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="change_desc">Top Gainers</option>
              <option value="change_asc">Top Losers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Table */}
      <div className="ent-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ent-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price (INR)</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredCoins.length > 0 ? (
                filteredCoins.map((coin, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    key={coin.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/coin/${coin.id}`)}
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
                    <td className="font-mono font-medium">
                      ₹{coin.current_price?.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div className={`flex items-center gap-1 font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} 
                        {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)] font-mono">
                      ₹{(coin.market_cap / 10000000).toFixed(1)}Cr
                    </td>
                    <td className="text-[var(--text-secondary)] font-mono">
                      ₹{(coin.total_volume / 10000000).toFixed(1)}Cr
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(coin.id);
                          }}
                          className={`text-xl transition-transform hover:scale-125 ${watchlist.includes(coin.id) ? 'text-amber-500' : 'text-gray-300'}`}
                          title="Watchlist"
                        >
                          {watchlist.includes(coin.id) ? <HiStar /> : <HiOutlineStar />}
                        </button>
                        <button className="text-[var(--accent-primary)] hover:underline font-bold text-xs flex items-center gap-1 group">
                          Details <HiOutlineArrowNarrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-[var(--text-muted)] font-medium italic">
                    No results found for "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredCoins.length > 0 && (
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border-base)] pt-6">
          <p className="text-xs text-[var(--text-muted)] font-medium">Page {page} of Market Registry</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === 1}
              className="btn-ent-secondary py-1.5 px-3 text-xs disabled:opacity-30"
            >
              Previous
            </button>
            <div className="w-8 h-8 rounded border border-[var(--border-base)] flex items-center justify-center text-xs font-bold bg-[var(--accent-primary)] text-white">
              {page}
            </div>
            <button
              onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={coins.length < 25}
              className="btn-ent-secondary py-1.5 px-3 text-xs disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Market;
