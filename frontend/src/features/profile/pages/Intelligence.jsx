import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck, 
  HiOutlineDatabase,
  HiOutlineLockClosed,
  HiOutlineRefresh,
  HiOutlineExclamationCircle
} from 'react-icons/hi';
import { useAuth } from '../../auth/context/AuthContext';
import { ROUTES } from '../../../shared/constants/routes';
import marketService from '../../market/services/marketService';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { formatCurrency, formatDateTime, formatPercentage } from '../../../shared/utils/formatters';

const ACTIVITY_REFRESH_INTERVAL = 60_000;

const deriveLargePlayerActivity = (bitcoin, globalMarket) => {
  const priceChange = Number(bitcoin?.change24h) || 0;
  const volume = Number(bitcoin?.volume) || 0;
  const marketCap = Number(bitcoin?.marketCap) || 0;
  const turnover = marketCap > 0 ? (volume / marketCap) * 100 : 0;
  const globalVolumeChange = Number(globalMarket?.volumeChange) || 0;

  if (turnover >= 5 && priceChange <= -1) {
    return {
      label: 'Potential distribution pressure',
      tone: 'negative',
      summary: 'BTC turnover is elevated while price is declining, which can indicate stronger selling activity.',
      priceChange,
      turnover,
      volume,
      globalVolumeChange,
    };
  }

  if (turnover >= 5 && priceChange >= 1) {
    return {
      label: 'Potential accumulation momentum',
      tone: 'positive',
      summary: 'BTC turnover is elevated while price is rising, which can indicate stronger buying activity.',
      priceChange,
      turnover,
      volume,
      globalVolumeChange,
    };
  }

  return {
    label: turnover >= 5 ? 'Elevated mixed activity' : 'Normal market activity',
    tone: 'neutral',
    summary: turnover >= 5
      ? 'BTC turnover is elevated, but price direction does not show a clear accumulation or distribution bias.'
      : 'BTC turnover and price direction are within their normal short-term range.',
    priceChange,
    turnover,
    volume,
    globalVolumeChange,
  };
};

const Intelligence = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [largePlayerActivity, setLargePlayerActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');
  const [activityUpdatedAt, setActivityUpdatedAt] = useState(null);
  
  const isPro = (user?.subscription || '').toLowerCase() === 'pro' || (user?.subscription || '').toLowerCase() === 'elite';

  const fetchLargePlayerActivity = useCallback(async ({ silent = false } = {}) => {
    if (!isPro) return;

    try {
      if (!silent) setActivityLoading(true);
      setActivityError('');
      const [coinMap, globalMarket] = await Promise.all([
        marketService.getCoinsByIds(['bitcoin']),
        marketService.getGlobalData(),
      ]);
      const bitcoin = coinMap.bitcoin;
      if (!bitcoin) throw new Error('Bitcoin market data is unavailable.');

      setLargePlayerActivity(deriveLargePlayerActivity(bitcoin, globalMarket));
      setActivityUpdatedAt(new Date());
    } catch (error) {
      setActivityError(getApiErrorMessage(error, 'Live market activity is unavailable right now.'));
    } finally {
      setActivityLoading(false);
    }
  }, [isPro]);

  useEffect(() => {
    if (!isPro) return undefined;

    fetchLargePlayerActivity();
    const intervalId = window.setInterval(
      () => fetchLargePlayerActivity({ silent: true }),
      ACTIVITY_REFRESH_INTERVAL,
    );
    return () => window.clearInterval(intervalId);
  }, [fetchLargePlayerActivity, isPro]);

  if (!isPro) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-[var(--warning-soft)] rounded-full flex items-center justify-center text-[var(--warning)] text-4xl mb-6">
          <HiOutlineLockClosed />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pro Intelligence Only</h1>
        <p className="text-[var(--text-muted)] max-w-md mb-8">
          The Intelligence Terminal is exclusive to Pro and Elite members. Upgrade your account to access institutional-grade analytics and AI-driven signals.
        </p>
        <button onClick={() => navigate(ROUTES.profile)} className="btn-ent-primary px-8">Upgrade Now</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HiOutlineLightningBolt className="text-amber-500" />
            Intelligence Terminal
          </h1>
          <p className="text-[var(--text-muted)]">Advanced algorithmic insights and market sentiment analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500 text-white rounded-sm text-[10px] font-black tracking-tighter uppercase border border-amber-600 shadow-sm">
          <HiOutlineShieldCheck className="text-sm" /> PRO ACCESS ACTIVE
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Elite Advice (Elite Only) - NEW FEATURE */}
          <div className={`ent-card p-6 relative overflow-hidden ${user?.subscription?.toLowerCase() !== 'elite' ? 'opacity-70 grayscale' : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30'}`}>
            {user?.subscription?.toLowerCase() !== 'elite' && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/5 backdrop-blur-[2px]">
                <HiOutlineLockClosed className="text-3xl text-emerald-600 mb-2" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Elite Portfolio Advisor</p>
                <button onClick={() => navigate(ROUTES.profile)} className="mt-2 text-[10px] font-bold text-emerald-600 hover:underline">Upgrade to Elite</button>
              </div>
            )}
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-600">
              <HiOutlineShieldCheck /> Smart Advisor
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-elevated)] rounded-lg border border-emerald-500/30">
                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Holding Advice</p>
                <p className="text-xs font-bold mb-1">BTC & ETH: <span className="text-emerald-500 uppercase">HOLD</span></p>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Stable accumulation phase. Avoid selling now as institutional support is strong at these levels.</p>
              </div>
              <div className="p-4 bg-[var(--bg-elevated)] rounded-lg border border-emerald-500/30">
                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Market Picks</p>
                <p className="text-xs font-bold mb-1">Top Pick: <span className="text-indigo-500 uppercase">SOLANA (SOL)</span></p>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Network growth and TVL (Total Value Locked) surge indicates potential 15-20% upside this month.</p>
              </div>
            </div>
          </div>

          {/* AI Trading Signals (Pro+) */}
          <div className="ent-card p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HiOutlineDatabase className="text-indigo-500" /> Market Analysis Signals
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase">Live Market Data</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mb-4 italic">
              *Signals generated by analyzing global market sentiment and volume for top coins (Independent of your current holdings).
            </p>
            <div className="space-y-4">
              {[
                { pair: 'Bitcoin (BTC)', signal: 'Strong Buy', confidence: '94%', reason: 'Large investors are buying' },
                { pair: 'Ethereum (ETH)', signal: 'Hold', confidence: '62%', reason: 'Waiting for next support level' },
                { pair: 'Solana (SOL)', signal: 'Buy', confidence: '81%', reason: 'Growing ecosystem popularity' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-base)]">
                  <div>
                    <p className="font-bold">{item.pair}</p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.signal.includes('Buy') ? 'text-[var(--positive)]' : 'text-[var(--text-secondary)]'}`}>{item.signal}</p>
                    <p className="text-xs text-[var(--text-muted)]">AI Score: {item.confidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Pulse (Pro+) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="ent-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Market Mood Pulse</h3>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-[var(--bg-muted)]" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-amber-500" strokeDasharray="72, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">72</span>
                    <span className="text-[8px] font-bold text-amber-500 uppercase">Greed</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">Score of 0 (Panic) to 100 (Euphoria)</p>
            </div>

            <div className="ent-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Price Swing Risk</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>24H RISK LEVEL</span>
                    <span className="text-rose-500 uppercase">High</span>
                  </div>
                  <div className="w-full bg-[var(--bg-muted)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Price swings might be larger than normal due to high trading volume.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar analytics */}
        <div className="space-y-6">
          <div className="ent-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Price Relationships</h3>
            <div className="space-y-3">
              {[
                { pair: 'BTC vs ETH', corr: '0.92', status: 'Move Together' },
                { pair: 'BTC vs Gold', corr: '0.15', status: 'Independent' },
                { pair: 'ETH vs SOL', corr: '0.84', status: 'Move Together' },
                { pair: 'BTC vs Stock Market', corr: '0.64', status: 'Moderate' },
              ].map((c, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)]">{c.pair}</span>
                  <span className={`font-mono font-bold ${parseFloat(c.corr) > 0.8 ? 'text-rose-500' : 'text-[var(--accent-primary)]'}`}>{c.corr}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-[var(--text-muted)] mt-4 leading-tight italic">*A score of 1.0 means they move perfectly in sync.</p>
          </div>

          <div className="ent-card overflow-hidden">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-base)] bg-[var(--bg-subtle)] px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--positive)] animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Large-player activity proxy</h3>
                </div>
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">Live BTC market data · refreshes every minute</p>
              </div>
              <button
                type="button"
                onClick={() => fetchLargePlayerActivity()}
                disabled={activityLoading}
                className="rounded-md border border-[var(--border-base)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] disabled:opacity-50"
                aria-label="Refresh large-player activity"
              >
                <HiOutlineRefresh className={activityLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="p-5">
              {activityLoading && !largePlayerActivity ? (
                <div className="space-y-3 animate-pulse">
                  <div className="ui-skeleton h-5 w-2/3" />
                  <div className="ui-skeleton h-14 w-full" />
                  <div className="grid grid-cols-2 gap-3"><div className="ui-skeleton h-12" /><div className="ui-skeleton h-12" /></div>
                </div>
              ) : activityError && !largePlayerActivity ? (
                <div className="flex flex-col items-center py-4 text-center text-[var(--negative)]">
                  <HiOutlineExclamationCircle className="mb-2 text-2xl" />
                  <p className="text-xs">{activityError}</p>
                  <button type="button" onClick={() => fetchLargePlayerActivity()} className="btn-ent-secondary mt-3 text-xs">Try again</button>
                </div>
              ) : largePlayerActivity && (
                <div className="space-y-4">
                  <div>
                    <span className={`ui-badge ${
                      largePlayerActivity.tone === 'positive'
                        ? 'ui-status-positive'
                        : largePlayerActivity.tone === 'negative'
                          ? 'ui-status-negative'
                          : 'ui-status-warning'
                    }`}>
                      {largePlayerActivity.label}
                    </span>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">{largePlayerActivity.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-[var(--border-base)] bg-[var(--bg-subtle)] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">BTC 24h volume</p>
                      <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">{formatCurrency(largePlayerActivity.volume, { compact: true, maximumFractionDigits: 1 })}</p>
                    </div>
                    <div className="rounded-md border border-[var(--border-base)] bg-[var(--bg-subtle)] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Volume / market cap</p>
                      <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">{formatPercentage(largePlayerActivity.turnover, { maximumFractionDigits: 1 })}</p>
                    </div>
                    <div className="rounded-md border border-[var(--border-base)] bg-[var(--bg-subtle)] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">BTC price change</p>
                      <p className={`mt-1 text-sm font-bold ${largePlayerActivity.priceChange >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                        {formatPercentage(largePlayerActivity.priceChange, { showSign: true, maximumFractionDigits: 1 })}
                      </p>
                    </div>
                    <div className="rounded-md border border-[var(--border-base)] bg-[var(--bg-subtle)] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Global volume change</p>
                      <p className={`mt-1 text-sm font-bold ${largePlayerActivity.globalVolumeChange >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                        {formatPercentage(largePlayerActivity.globalVolumeChange, { showSign: true, maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-base)] pt-3">
                    <p className="text-[9px] leading-relaxed text-[var(--text-muted)]">
                      Market-derived proxy, not a wallet-transfer tracker. It does not prove that a specific holder is buying or selling.
                    </p>
                    <p className="mt-1 text-[9px] text-[var(--text-muted)]">Updated {formatDateTime(activityUpdatedAt)}</p>
                    {activityError && <p className="mt-1 text-[9px] text-[var(--warning)]">Latest refresh failed; showing the last successful reading.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Institutional Reports (Elite Only) */}
          <div className={`ent-card p-6 ${user?.subscription?.toLowerCase() !== 'elite' ? 'opacity-50' : 'border-blue-500/30 bg-blue-500/5'}`}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center justify-between">
              Premium Reports {user?.subscription?.toLowerCase() !== 'elite' && <HiOutlineLockClosed className="text-xs" />}
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Weekly Market Outlook', date: 'May 12' },
                { title: 'Early-Stage Coin Alert', date: 'May 10' },
                { title: 'DeFi Opportunity Report', date: 'May 08' },
              ].map((report, i) => (
                <li key={ report.title } className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="group-hover:text-[var(--accent-primary)] transition-colors">{report.title}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{report.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Intelligence;
