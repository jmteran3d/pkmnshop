import dotenv from 'dotenv';

dotenv.config();

export const env={
    PORT:3000,
    MONGO_URL:"mongodb+srv://jmcoder:coderpass@backend2.uixncin.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Backend2",
    DB_NAME: "myEcommerce",
    API_KEY_GOOGLE: "",
    SECRET_SESSION: "coderpass",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES: process.env.JWT_EXPIRES || '1d',
    COOKIE_NAME: process.env.COOKIE_NAME || "jwtCookie",
}