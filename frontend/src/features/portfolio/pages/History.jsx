import React, { useCallback, useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { motion } from 'framer-motion';
import { 
  HiOutlineClock, 
  HiOutlineArrowSmDown, 
  HiOutlineArrowSmUp,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import { formatCryptoQuantity, formatCurrency, formatDateTime } from '../../../shared/utils/formatters';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await portfolioService.getTransactions(page, 25);
      if (res.success) {
        setTransactions(res.data);
        setTotalPages(Math.max(res.pagination?.pages || 1, 1));
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to fetch transaction history');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTransactions = transactions.filter(t => 
    filter === 'ALL' ? true : t.type === filter
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="page-container flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-48 ui-skeleton" />
      {[1, 2, 3, 4].map(i => <div key={i} className="h-16 ui-skeleton" />)}
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="ui-error-state">
        <HiOutlineExclamationCircle className="text-3xl" />
        <p className="font-semibold">Unable to load transaction activity</p>
        <p className="max-w-md text-sm">{error}</p>
        <button type="button" onClick={fetchHistory} className="btn-ent-secondary mt-2">Try again</button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">
            <span>Account</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Activity History</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transaction Activity</h1>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border-base)]">
          {['ALL', 'BUY', 'SELL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                filter === f 
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="ent-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-base)]">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Quantity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-base)]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <motion.tr 
                    variants={itemVariants} 
                    key={t._id} 
                    className="group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {formatDateTime(t.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`ui-badge text-[10px] font-bold uppercase tracking-wide ${
                        t.type === 'BUY' 
                        ? 'ui-status-positive'
                        : 'ui-status-negative'
                      }`}>
                        {t.type === 'BUY' ? <HiOutlineArrowSmDown /> : <HiOutlineArrowSmUp />}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[var(--accent-primary)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--accent-primary)]">
                          {t.coinSymbol?.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[var(--text-primary)] uppercase">{t.coinSymbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-mono text-[var(--text-primary)]">{formatCryptoQuantity(t.quantity)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-mono text-[var(--text-secondary)]">{formatCurrency(t.price)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{formatCurrency(t.totalAmount)}</span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <HiOutlineClock className="text-5xl mb-4" />
                      <p className="text-sm font-medium">No transactions found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="btn-ent-secondary disabled:opacity-40">Previous</button>
            <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="btn-ent-secondary disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default History;
