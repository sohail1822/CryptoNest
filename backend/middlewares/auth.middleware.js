import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "../config/env.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, env.SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please authenticate.",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    res.status(401).json({
      success: false,
      message: "Invalid token. Please authenticate.",
    });
  }
};

export default auth;
