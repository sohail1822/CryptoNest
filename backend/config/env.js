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
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
  CORS_ORIGIN:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_CORS_ORIGIN
      : process.env.PROD_CORS_ORIGIN,
};


export default env;