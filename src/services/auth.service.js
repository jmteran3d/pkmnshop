import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import PasswordResetRepository from "../repositories/passwordReset.repository.js";
import { hashPassword, comparePassword, randomToken } from "../utils/hash.js";
import { sendResetPasswordMail } from "./mail.service.js";

const users = new UserRepository();
const carts = new CartRepository();
const resets = new PasswordResetRepository();

export const registerUser = async (payload) => {
  const exists = await users.findByEmail(payload.email);
  if (exists) throw new Error("Email ya registrado");
  const cart = await carts.create();
  const password = await hashPassword(payload.password);
  const user = await users.create({ ...payload, password, cart: cart._id });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await users.findByEmail(email);
  if (!user) throw new Error("Credenciales inválidas");
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, cart: user.cart },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

// Recuperación: generar token único, TTL por modelo
export const requestPasswordReset = async (email, baseUrl) => {
  const user = await users.findByEmail(email);
  if (!user) return; // no revelar si existe o no

  const token = randomToken(24);
  await resets.create({ userId: user._id, token });
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  await sendResetPasswordMail({ to: user.email, resetUrl });
};

export const resetPassword = async (token, newPassword) => {
  const record = await resets.findByToken(token);
  if (!record) throw new Error("Token inválido o expirado");

  const user = await users.findById(record.userId);
  // Evitar reutilización
  const same = await comparePassword(newPassword, user.password);
  if (same) throw new Error("La nueva contraseña no puede ser igual a la anterior");

  const newHash = await hashPassword(newPassword);
  await users.updatePassword(user._id, newHash);
  await resets.deleteById(record._id);
};
