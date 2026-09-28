import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";
import cryptoService from "./crypto.service.js";


export const getPortfolio = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stocks: userData.stocks,
        credits: userData.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const addStock = async (req, res, next) => {
  try {
    const { stockId } = req.body;
    const quantity = Number(req.body.quantity);
    const userId = req.userId;
    const quote = await cryptoService.getTradeQuote(stockId, "INR");
    const totalAmount = quote.currentPrice * quantity;

    const myUser = await User.findById(userId);
    if (!myUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to calculate a valid trade amount.",
      });
    }

    if (myUser.credits < totalAmount) {
      return res.status(400).json({
        success: false,
        data: { message: "Insufficient Credits" },
      });
    }

    // Check if the stock already exists in portfolio
    const existingStock = await User.findOne({
      _id: userId,
      stocks: { $elemMatch: { stockId } },
    });

    if (existingStock) {
      // Update existing stock quantity
      await User.updateOne(
        { _id: userId, stocks: { $elemMatch: { stockId } } },
        {
          $inc: {
            "stocks.$.quantity": quantity,
            credits: -totalAmount,
            "stocks.$.total_amount": totalAmount,
          },
        },
      );
    } else {
      // Add new stock to portfolio
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            stocks: {
              stockId,
              quantity,
              total_amount: totalAmount,
            },
          },
          $inc: { credits: -totalAmount },
        },
        { new: true },
      );
    }

    // Record Transaction
    await Transaction.create({
      userId,
      coinId: stockId,
      coinSymbol: quote.symbol.toUpperCase(),
      type: 'BUY',
      quantity,
      price: quote.currentPrice,
      totalAmount,
    });

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      data: {
        stocks: updatedUser.stocks,
        credits: updatedUser.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const removeStock = async (req, res, next) => {
  try {
    const { stockId } = req.body;
    const quantity = Number(req.body.quantity);
    const userId = req.userId;

    const user = await User.findOne({
      _id: userId,
      stocks: { $elemMatch: { stockId } },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User or stock not found.",
      });
    }

    const stock = user.stocks.find((s) => s.stockId === stockId);
    if (!stock || quantity > stock.quantity) {
      return res.status(400).json({
        success: false,
        message: "You cannot sell more than the quantity you own.",
      });
    }

    const quote = await cryptoService.getTradeQuote(stockId, "INR");
    const totalAmount = quote.currentPrice * quantity;
    const newQuantity = stock.quantity - quantity;
    const newTotalAmount = newQuantity > 0
      ? stock.total_amount * (newQuantity / stock.quantity)
      : 0;

    if (newQuantity > 0) {
      // Reduce stock quantity
      await User.updateOne(
        { _id: userId, stocks: { $elemMatch: { stockId } } },
        {
          $set: {
            "stocks.$.quantity": newQuantity,
            "stocks.$.total_amount": newTotalAmount,
          },
          $inc: { credits: totalAmount },
        },
      );
    } else {
      // Remove stock entirely
      await User.updateOne(
        { _id: userId },
        {
          $inc: { credits: totalAmount },
          $pull: { stocks: { stockId } },
        },
        { new: true },
      );
    }

    // Record Transaction
    await Transaction.create({
      userId,
      coinId: stockId,
      coinSymbol: quote.symbol.toUpperCase(),
      type: 'SELL',
      quantity,
      price: quote.currentPrice,
      totalAmount,
    });

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      data: {
        stocks: updatedUser.stocks,
        credits: updatedUser.credits,
        amount_left: newTotalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;

    const userData = await User.findById(userId).select("watchlist");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: userData.watchlist || [],
    });
  } catch (error) {
    next(error);
  }
};


export const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { coinId, coinSymbol } = req.body;

    if (!coinId) {
      return res.status(400).json({
        success: false,
        message: "Please provide coinId.",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if coin already in watchlist
    const exists = userData.watchlist.some((item) => item.coinId === coinId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Coin already in watchlist.",
      });
    }

    // Add to watchlist
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          watchlist: {
            coinId,
            coinSymbol: coinSymbol || coinId.toUpperCase(),
          },
        },
      },
      { new: true },
    );

    const updatedUser = await User.findById(userId).select("watchlist");

    res.status(200).json({
      success: true,
      data: updatedUser.watchlist,
      message: "Coin added to watchlist.",
    });
  } catch (error) {
    next(error);
  }
};



export const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { coinId } = req.body;

    if (!coinId) {
      return res.status(400).json({
        success: false,
        message: "Please provide coinId.",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Remove from watchlist
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: { coinId },
        },
      },
      { new: true },
    );

    const updatedUser = await User.findById(userId).select("watchlist");

    res.status(200).json({
      success: true,
      data: updatedUser.watchlist,
      message: "Coin removed from watchlist.",
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
