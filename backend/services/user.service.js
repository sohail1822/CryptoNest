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
        message: "Insufficient credits.",
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
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "watchlist.coinId": { $ne: coinId } },
      {
        $push: {
          watchlist: {
            coinId,
            coinSymbol: (coinSymbol || coinId).toUpperCase(),
          },
        },
      },
      { new: true },
    ).select("watchlist");

    if (!updatedUser) {
      const userExists = await User.exists({ _id: userId });
      return res.status(userExists ? 400 : 404).json({
        success: false,
        message: userExists ? "Coin already in watchlist." : "User not found.",
      });
    }

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
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: { coinId },
        },
      },
      { new: true },
    ).select("watchlist");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

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
    const userId = req.userId;
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 50;
    const filter = { userId };
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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

export const updateSubscription = async (req, res, next) => {
  try {
    const { tier } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { subscription: tier },
      { new: true, runValidators: true },
    ).select("subscription");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Plan changed to ${tier}.`,
      data: { subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};
