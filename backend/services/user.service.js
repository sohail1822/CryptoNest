import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";


export const getPortfolio = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const cleanUserId = userId.replace(/['\"]+/g, "");
    const userData = await User.findById(cleanUserId);

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
    let { userId, stockId, current_price, quantity } = req.body;

    if (!userId || !stockId || !current_price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, stockId, current_price, and quantity.",
      });
    }

    userId = userId.replace(/['\"]+/g, "");
    current_price = parseFloat(current_price);
    quantity = parseFloat(quantity);

    const myUser = await User.findById(userId);
    if (!myUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (myUser.credits - current_price < 0) {
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
            credits: -current_price,
            "stocks.$.total_amount": current_price,
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
              total_amount: current_price,
            },
          },
          $inc: { credits: -current_price },
        },
        { new: true },
      );
    }

    // Record Transaction
    await Transaction.create({
      userId,
      coinId: stockId,
      coinSymbol: stockId.toUpperCase(), // Best guess, will be refined if symbol is provided
      type: 'BUY',
      quantity,
      price: current_price / quantity,
      totalAmount: current_price
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
    let { userId, stockId, current_price, quantity } = req.body;

    if (!userId || !stockId || !current_price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, stockId, current_price, and quantity.",
      });
    }

    userId = userId.replace(/['\"]+/g, "");
    current_price = parseFloat(current_price);
    quantity = parseFloat(quantity);

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
    const newQuantity = stock.quantity - quantity;
    const newTotalAmount = stock.total_amount - current_price;

    if (newQuantity > 0 && newTotalAmount > 5) {
      // Reduce stock quantity
      await User.updateOne(
        { _id: userId, stocks: { $elemMatch: { stockId } } },
        {
          $set: {
            "stocks.$.quantity": newQuantity,
            "stocks.$.total_amount": newTotalAmount,
          },
          $inc: { credits: current_price },
        },
      );
    } else {
      // Remove stock entirely
      await User.updateOne(
        { _id: userId },
        {
          $inc: { credits: current_price },
          $pull: { stocks: { stockId } },
        },
        { new: true },
      );
    }

    // Record Transaction
    await Transaction.create({
      userId,
      coinId: stockId,
      coinSymbol: stockId.toUpperCase(),
      type: 'SELL',
      quantity,
      price: current_price / quantity,
      totalAmount: current_price
    });

    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      data: {
        stocks: updatedUser.stocks,
        credits: updatedUser.credits,
        amount_left: newTotalAmount > 5 ? newTotalAmount : 0,
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

export const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { tier } = req.body;

    if (!tier) {
      return res.status(400).json({
        success: false,
        message: "Subscription tier is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.subscription = tier;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Subscription updated to ${tier} successfully.`,
      data: { subscription: user.subscription }
    });
  } catch (error) {
    next(error);
  }
};
