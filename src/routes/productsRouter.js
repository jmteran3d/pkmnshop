import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { authJWT, authorizeRoles } from "../middleware/auth.js";

export const router = Router();

// Listado de productos (abierto)
router.get("/", ProductsController.getProducts);

// CRUD de productos (solo admin)
router.post("/", authJWT, authorizeRoles("admin"), ProductsController.createProduct);
router.put("/:id", authJWT, authorizeRoles("admin"), ProductsController.updateProduct);
router.delete("/:id", authJWT, authorizeRoles("admin"), ProductsController.deleteProduct);
