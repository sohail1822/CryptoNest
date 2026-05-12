import express from 'express';
import { 
  getPortfolio, 
  addStock, 
  removeStock, 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist,
  getTransactions,
  getProfile,
  changePassword,
  updateSubscription
} from '../services/user.service.js';
import auth from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/portfolio', getPortfolio);
router.post('/stock/add', auth, validate('buyCrypto'), addStock);
router.post('/stock/remove', auth, validate('sellCrypto'), removeStock);

router.get('/watchlist', auth, getWatchlist);
router.post('/watchlist/add', auth, validate('addToWatchlist'), addToWatchlist);
router.post('/watchlist/remove', auth, validate('removeFromWatchlist'), removeFromWatchlist);

router.get('/transactions', auth, getTransactions);
router.get('/profile', auth, getProfile);
router.post('/change-password', auth, changePassword);
router.post('/update-subscription', auth, updateSubscription);

export default router;
