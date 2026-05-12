import mongoose from 'mongoose';

const cryptoCacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const CryptoCache = mongoose.model('CryptoCache', cryptoCacheSchema);

export default CryptoCache;
