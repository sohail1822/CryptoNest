import env, { validateEnv } from "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

// ─── Start Server ────────────────────────────────────────
const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error(`Server startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default startServer;
