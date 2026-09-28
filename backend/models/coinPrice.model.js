import mongoose from 'mongoose';

const coinPriceSchema = new mongoose.Schema({
  provider: { type: String, default: 'coinstats', index: true },
  coinId: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  currentPrice: { type: Number, required: true },
  marketCap: { type: Number },
  marketCapRank: { type: Number },
  totalVolume: { type: Number },
  priceChange1h: { type: Number },
  priceChange24h: { type: Number },
  priceChangePercentage24h: { type: Number },
  priceChange7d: { type: Number },
  priceChange30d: { type: Number },
  allTimeHigh: { type: Number },
  allTimeLow: { type: Number },
  lastUpdated: { type: Date, default: Date.now }
});

const CoinPrice = mongoose.model('CoinPrice', coinPriceSchema);
export default CoinPrice;
