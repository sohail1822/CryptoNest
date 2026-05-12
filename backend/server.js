import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cryptoRoutes from "./routes/crypto.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "CryptoNest API is running ",
    version: "2.0.0",
  });
});

// ─── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crypto", cryptoRoutes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Error Handler ───────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(` Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();

export default app;
