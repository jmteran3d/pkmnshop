import { Router } from "express";
import { authJWT, authorizeRoles } from "../middleware/auth.js";
import UserController from "../controllers/users.controller.js";

export const router = Router();

// 🔹 Listar todos los usuarios (solo admin)
router.get("/", authJWT, authorizeRoles("admin"), UserController.getUsers);

// 🔹 Obtener usuario por ID (solo admin o dueño)
router.get("/:uid", authJWT, UserController.getUserById);

// 🔹 Actualizar usuario (solo admin o dueño)
router.put("/:uid", authJWT, UserController.updateUser);

// 🔹 Eliminar usuario (solo admin)
router.delete("/:uid", authJWT, authorizeRoles("admin"), UserController.deleteUser);
