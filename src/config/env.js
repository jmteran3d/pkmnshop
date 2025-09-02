import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  API_KEY_GOOGLE: process.env.API_KEY_GOOGLE,
  SECRET_SESSION: process.env.SECRET_SESSION,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  COOKIE_NAME: process.env.COOKIE_NAME,
};