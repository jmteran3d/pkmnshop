import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 10;

// Hash asíncrono
export const hashPassword = async (plain) => {
  try {
    return await bcrypt.hash(plain, SALT_ROUNDS);
  } catch (error) {
    console.error("Error al hashear la contraseña:", error);
    throw new Error("Error al procesar la contraseña");
  }
};

// Comparación asíncrona
export const comparePassword = async (plain, hash) => {
  try {
    return await bcrypt.compare(plain, hash);
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    throw new Error("Error al verificar la contraseña");
  }
};

// Token aleatorio seguro
export const randomToken = (len = 48) => crypto.randomBytes(len).toString("hex");
