import React, { useState, useEffect, useCallback } from 'react';
import marketService from '../services/marketService';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../watchlist/context/WatchlistContext';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { 
  HiOutlineSearch, 
  HiOutlineSortAscending,
  HiStar, 
  HiOutlineStar,
  HiOutlineArrowNarrowRight,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const Market = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('rank'); // default
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await marketService.getCoins(page, 50);
      setCoins(data);
    } catch (err) {
      setCoins([]);
      setError(getApiErrorMessage(err, 'Market data is unavailable right now.'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const sortedCoins = [...coins].sort((a, b) => {
    if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice;
    if (sortBy === 'price_asc') return a.currentPrice - b.currentPrice;
    if (sortBy === 'change_desc') return b.change24h - a.change24h;
    if (sortBy === 'change_asc') return a.change24h - b.change24h;
    if (sortBy === 'market_cap_desc') return b.marketCap - a.marketCap;
    return a.rank - b.rank; // default rank
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
      <div className="mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
            <span>Live</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Market</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Market Coins</h1>
        </div>
      </div>

      <div className="ent-card mb-8 overflow-hidden">
        <div className="border-b border-[var(--border-base)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by coin name or symbol"
                className="ent-input py-2.5 pl-10 pr-14"
                aria-label="Search market coins"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Clear market search"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="whitespace-nowrap text-xs text-[var(--text-muted)]">
              {loading ? 'Loading market…' : `${filteredCoins.length} coin${filteredCoins.length === 1 ? '' : 's'} shown`}
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-subtle)] px-4 py-3 sm:px-5">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <HiOutlineSortAscending className="text-base text-[var(--accent-primary)]" />
            Sort market
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Sort market coins">
            {[
              { value: 'rank', label: 'Market rank' },
              { value: 'market_cap_desc', label: 'Market cap' },
              { value: 'price_desc', label: 'Price: high' },
              { value: 'price_asc', label: 'Price: low' },
              { value: 'change_desc', label: 'Top gainers' },
              { value: 'change_asc', label: 'Top losers' },
            ].map((option) => {
              const isActive = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
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
      </div>

      {/* Market Table */}
      {error ? (
        <div className="ui-error-state">
          <HiOutlineExclamationCircle className="text-3xl" />
          <p className="font-semibold">Unable to load the market</p>
          <p className="max-w-md text-sm">{error}</p>
          <button type="button" onClick={fetchCoins} className="btn-ent-secondary mt-2">Try again</button>
        </div>
      ) : <div className="ent-card overflow-hidden">
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
                      <div className="ui-skeleton h-4 w-full" />
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
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.coin(coin.id))}
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
                      {formatCurrency(coin.currentPrice)}
                    </td>
                    <td>
                      <div className={`flex items-center gap-1 font-bold ${coin.change24h >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                        {coin.change24h >= 0 ? '▲' : '▼'}
                        {formatPercentage(Math.abs(coin.change24h))}
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)] font-mono">
                      {formatCurrency(coin.marketCap, { compact: true, maximumFractionDigits: 1 })}
                    </td>
                    <td className="text-[var(--text-secondary)] font-mono">
                      {formatCurrency(coin.volume, { compact: true, maximumFractionDigits: 1 })}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(coin.id);
                          }}
                          className={`text-xl transition-colors ${watchlist.includes(coin.id) ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}
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
      </div>}

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
              disabled={coins.length < 50}
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
