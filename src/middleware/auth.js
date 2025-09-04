import passport from "passport";
import jwt from "jsonwebtoken";
import PasswordReset from "../dao/models/passwordReset.model.js";
import { env } from "../config/env.js";

// Middleware de autenticación por sesión o JWT
export const auth = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ status: "error", error: "No hay usuario autenticado" });
  }
  next();
};

export const authJWT = passport.authenticate("jwt", { session: false });

// Middleware de autorización por roles
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "error", error: "No autenticado" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ status: "error", error: "No autorizado" });
  }
  next();
};

// Middleware para verificar TTL de token de recuperación de contraseña
export const verifyResetTokenTTL = async (req, res, next) => {
  try {
    const { token } = req.body; // o req.query si viene por URL
    if (!token) return res.status(400).json({ status: "error", error: "Token requerido" });

    const record = await PasswordReset.findOne({ token });
    if (!record) return res.status(400).json({ status: "error", error: "Token inválido" });

    const createdAt = record.createdAt;
    const now = new Date();
    const diffMs = now - createdAt;
    const ttlMs = 60 * 60 * 1000; // 1 hora

    if (diffMs > ttlMs) {
      await PasswordReset.findByIdAndDelete(record._id); // eliminar token expirado
      return res.status(400).json({ status: "error", error: "Token expirado" });
    }

    req.resetRecord = record; // pasar info del token al siguiente middleware/controlador
    next();
  } catch (err) {
    console.error("Error en verifyResetTokenTTL:", err);
    res.status(500).json({ status: "error", error: "Error interno" });
  }
};

// Middleware opcional para extraer usuario desde JWT en cookie
export const extractUserFromJWT = (req, res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME] || req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
  } catch {
    req.user = null;
  }
  next();
};