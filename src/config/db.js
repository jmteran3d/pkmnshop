import mongoose from "mongoose";
import { config } from "./config.js";
config

export const conectarDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {dbName:config.DB_NAME});
    console.log(`Conectado con MongoDB establecida!`);
  } catch (error) {
    console.log(`Error al conectar con MongoDB: ${error.message}`);
  }
};
