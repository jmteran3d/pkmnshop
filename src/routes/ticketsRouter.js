import { Router } from "express";
import { TicketsController } from "../controllers/tickets.controller.js";
import { authJWT, authorizeRoles } from "../middleware/auth.js";

export const router = Router();

// Crear ticket de compra (usuario)
router.post("/", authJWT, authorizeRoles("user"), TicketsController.createTicket);

// Obtener todos los tickets (admin)
router.get("/", authJWT, authorizeRoles("admin"), TicketsController.getTickets);

// Obtener ticket por ID (admin o propietario)
router.get("/:tid", authJWT, TicketsController.getTicketById);
