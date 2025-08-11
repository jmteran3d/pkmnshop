import mongoose from "mongoose";

export const conectarDB = (url, dbName) => {
  try {
    mongoose.connect(url, {
      // dbName: dbName,
      dbName,
    });
    console.log(`Conectado con MongoDB!`);
  } catch (error) {
    console.log(`Error al conectar con MongoDB: ${error.message}`);
  }
};
