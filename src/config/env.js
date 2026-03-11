import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`[ENV] Missing required environment variable: "${key}"`);
  }
  return value;
};

const optionalEnv = (key, defaultValue) => process.env[key] || defaultValue;

const parseIntEnv = (key, defaultValue) => {
  const value = process.env[key];
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const MONGO_URI = requireEnv("MONGO_URI");
export const PORT = parseIntEnv("PORT", 5001);
export const JWT_SECRET = requireEnv("JWT_SECRET");
export const NODE_ENV = optionalEnv("NODE_ENV", "development");
export const TURNSTILE_SECRET = requireEnv("TURNSTILE_SECRET");
export const CLOUDINARY_CLOUD_NAME = requireEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = requireEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = requireEnv("CLOUDINARY_API_SECRET");
