import mongoose from "mongoose";

const StockHoldingSchema = new mongoose.Schema(
  {
    stockId: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    total_amount: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const WatchlistSchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true },
    coinSymbol: { type: String, required: true },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, default: 1000000 },
    stocks: { type: [StockHoldingSchema], default: [] },
    watchlist: { type: [WatchlistSchema], default: [] },
    subscription: { type: String, enum: ['basic', 'pro', 'elite'], default: 'basic' },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

export default User;
