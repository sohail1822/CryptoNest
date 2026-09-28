import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env"), });

const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  COINSTATS_API_KEY: process.env.COINSTATS_API_KEY,
  CORS_ORIGIN:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_CORS_ORIGIN
      : process.env.PROD_CORS_ORIGIN,
};

const requiredConfig = ["MONGODB_URI", "SECRET_KEY", "COINSTATS_API_KEY"];

export const validateEnv = () => {
  const missing = requiredConfig.filter((key) => !env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Add them to backend/.env before starting the server.`,
    );
  }
};

export default env;
