import express from 'express';
import cryptoService from '../services/crypto.service.js';

const router = express.Router();

router.get('/markets', async (req, res, next) => {
  try {
    const { currency, vs_currency, limit, per_page, page, coinIds, ids } = req.query;
    const data = await cryptoService.getMarketData(
      currency || vs_currency,
      limit || per_page,
      page,
      coinIds || ids,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/global', async (req, res, next) => {
  try {
    const data = await cryptoService.getGlobalData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/sentiment', async (req, res, next) => {
  try {
    const data = await cryptoService.getFearGreedIndex();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/history/:coinId', async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const { days } = req.query;
    const data = await cryptoService.getCoinHistory(coinId, days || 7);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/coin/:coinId', async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const { currency } = req.query;
    const data = await cryptoService.getCoinById(coinId, currency);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
