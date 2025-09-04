import { Router } from "express";
import { SessionsController } from "../controllers/sessions.controller.js";
import { authJWT, authorizeRoles, verifyResetTokenTTL } from "../middleware/auth.js";

export const router = Router();

// Registro y login
router.post("/registro", SessionsController.registro);
router.post("/login", SessionsController.login);

// Ruta actual del usuario logueado
router.get("/current", authJWT, SessionsController.current);

// Logout
router.post("/logout", authJWT, SessionsController.logout);

// Recuperación de contraseña
router.post("/request-reset", SessionsController.requestPasswordReset); // envía mail
router.post("/reset-password", verifyResetTokenTTL, SessionsController.resetPassword); // restablece
