import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { authJWT, authorizeRoles } from "../middleware/auth.js";

export const router = Router();

// Crear carrito
router.post("/", authJWT, authorizeRoles("user"), CartsController.createCart);

// Obtener carrito
router.get("/:cid", authJWT, authorizeRoles("user"), CartsController.getCart);

// Agregar producto al carrito
router.post("/:cid/product/:pid", authJWT, authorizeRoles("user"), CartsController.addProductToCart);

// Quitar producto del carrito
router.delete("/:cid/product/:pid", authJWT, authorizeRoles("user"), CartsController.removeProductFromCart);

// Vaciar carrito
router.delete("/:cid", authJWT, authorizeRoles("user"), CartsController.clearCart);