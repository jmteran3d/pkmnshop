import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import UserRepository from "../repositories/UserRepository.js";
import { hashPassword, comparePassword, randomToken } from "../utils/hash.js";
import { sendResetPasswordMail } from "../services/mail.service.js";
import PasswordResetRepository from "../repositories/passwordReset.repository.js";
import UserCurrentDTO from "../dto/userCurrent.dto.js";

const users = new UserRepository();
const resets = new PasswordResetRepository();

function signToken(usuario) {
  const payload = {
    uid: usuario._id,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    email: usuario.email,
    age: usuario.age,
    role: usuario.role,
    cart: usuario.cart,
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
}

export class SessionsController {

  // 🔹 Registro
  static registro = async (req, res) => {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).render("registro", { error: "Campos obligatorios faltantes" });
      }

      const exists = await users.findByEmail(email);
      if (exists) {
        return res.status(409).render("registro", { error: "Email ya registrado" });
      }

      const user = await users.create({
        first_name,
        last_name,
        email,
        age: age ?? 0,
        password: hashPassword(password),
        role: role ?? "user"
      });

      const token = signToken(user);
      res.cookie(env.COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.redirect("/perfil");
    } catch (err) {
      console.error(err);
      return res.status(500).render("registro", { error: "Error en registro" });
    }
  };

  // 🔹 Login
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const usuario = await users.findByEmail(email);

      if (!usuario || !(await comparePassword(password, usuario.password))) {
        return res.status(401).render("login", { error: "Credenciales inválidas" });
      }

      const token = signToken(usuario);
      res.cookie(env.COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.redirect("/perfil");
    } catch (err) {
      console.error(err);
      return res.status(500).render("login", { error: "Error en login" });
    }
  };

  // 🔹 Perfil
  static current = async (req, res) => {
    try {
      if (!req.user) return res.redirect("/login");
      const safeUser = new UserCurrentDTO(req.user);
      return res.render("perfil", { user: safeUser, isLogin: true });
    } catch (err) {
      console.error(err);
      return res.status(500).render("perfil", { error: "Error al cargar perfil" });
    }
  };

  // 🔹 Logout
  static logout = (req, res) => {
    res.clearCookie(env.COOKIE_NAME);
    return res.redirect("/login");
  };

  // 🔹 Solicitar reset de contraseña
  static requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await users.findByEmail(email);
      if (!user) return res.json({ status: "success", message: "Si el email existe, se envió un link" });

      const token = randomToken(24);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await resets.create({ userId: user._id, token, expiresAt });

      const resetUrl = `${req.protocol}://${req.get("host")}/api/sessions/reset-password?token=${token}`;
      await sendResetPasswordMail({ to: user.email, resetUrl });

      return res.json({ status: "success", message: "Si el email existe, se envió un link" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "error", error: "Error al solicitar recuperación de contraseña" });
    }
  };

  // 🔹 Resetear contraseña
  static resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const record = await resets.findByToken(token);

      if (!record || new Date(record.expiresAt) < new Date()) {
        return res.status(400).json({ status: "error", error: "Token inválido o expirado" });
      }

      const user = await users.findById(record.userId);
      if (!user) return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

      if (await comparePassword(newPassword, user.password)) {
        return res.status(400).json({ status: "error", error: "La nueva contraseña no puede ser igual a la anterior" });
      }

      await users.updateById(user._id, { password: hashPassword(newPassword) });
      await resets.deleteById(record._id);

      return res.json({ status: "success", message: "Contraseña restablecida correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "error", error: "Error al restablecer contraseña" });
    }
  };
}
