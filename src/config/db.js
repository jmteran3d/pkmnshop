import mongoose from "mongoose";
import { env } from "./env.js";

export const conectarDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URL, {dbName:env.DB_NAME});
    console.log(`Conectado con MongoDB establecida!`);
  } catch (error) {
    console.log(`Error al conectar con MongoDB: ${error.message}`);
  }
};
