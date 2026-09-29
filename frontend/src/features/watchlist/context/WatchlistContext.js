import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import watchlistService from '../services/watchlistService';
import { useAuth } from '../../auth/context/AuthContext';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await watchlistService.getWatchlist();
      if (res.success) {
        setWatchlist(res.data.map(item => item.coinId));
      }
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const toggleWatchlist = async (coinId) => {
    if (!isAuthenticated) {
      toast.warning('Please login to use watchlist');
      return;
    }

    const isAdded = watchlist.includes(coinId);
    try {
      if (isAdded) {
        const res = await watchlistService.removeCoin(coinId);
        if (res.success) {
          setWatchlist(prev => prev.filter(id => id !== coinId));
          toast.success('Removed from watchlist');
        }
      } else {
        const res = await watchlistService.addCoin(coinId);
        if (res.success) {
          setWatchlist(prev => [...prev, coinId]);
          toast.success('Added to watchlist');
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update watchlist'));
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, loading, refreshWatchlist: fetchWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
