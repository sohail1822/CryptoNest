import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/cryptoService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await getWatchlist();
      if (res.success) {
        setWatchlist(res.data.map(item => item.coinId));
      }
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [isAuthenticated]);

  const toggleWatchlist = async (coinId) => {
    if (!isAuthenticated) {
      toast.warning('Please login to use watchlist');
      return;
    }

    const isAdded = watchlist.includes(coinId);
    try {
      if (isAdded) {
        const res = await removeFromWatchlist(coinId);
        if (res.success) {
          setWatchlist(prev => prev.filter(id => id !== coinId));
          toast.success('Removed from watchlist');
        }
      } else {
        const res = await addToWatchlist(coinId);
        if (res.success) {
          setWatchlist(prev => [...prev, coinId]);
          toast.success('Added to watchlist');
        }
      }
    } catch (err) {
      toast.error('Failed to update watchlist');
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
