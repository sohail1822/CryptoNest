import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import env from "../config/env.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password with hashed password using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      env.SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        token,
        first_name: user.first_name,
        last_name: user.last_name,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, address } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: { message: "User already exists" },
      });
    }

    // Hash password using bcryptjs (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      credits: 1000000,
      stocks: [],
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      env.SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      success: true,
      data: {
        userId: newUser._id,
        email: newUser.email,
        token,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
