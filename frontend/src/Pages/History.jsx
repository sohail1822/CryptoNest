import React, { useState, useEffect } from 'react';
import cryptoService from '../services/cryptoService';
import { motion } from 'framer-motion';
import { 
  HiOutlineClock, 
  HiOutlineArrowSmDown, 
  HiOutlineArrowSmUp,
  HiOutlineSearch,
  HiOutlineFilter
} from 'react-icons/hi';
import { toast } from 'react-toastify';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await cryptoService.getTransactions();
        if (res.success) {
          setTransactions(res.data);
        }
      } catch (err) {
        toast.error('Failed to fetch transaction history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
      {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg" />)}
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

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-[var(--border-base)]">
          {['ALL', 'BUY', 'SELL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                filter === f 
                ? 'bg-white dark:bg-gray-700 text-[var(--accent-primary)] shadow-sm' 
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
              <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-[var(--border-base)]">
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
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {new Date(t.date).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        t.type === 'BUY' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
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
                      <span className="text-sm font-mono text-[var(--text-primary)]">{t.quantity.toFixed(6)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-mono text-[var(--text-secondary)]">₹{t.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold font-mono text-[var(--text-primary)]">₹{t.totalAmount.toLocaleString()}</span>
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
    </motion.div>
  );
};

export default History;
