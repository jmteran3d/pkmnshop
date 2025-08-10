import { Router } from "express";
export const router = Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ payload: "Listado clientes" });
});

router.get("/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ payload: `Datos cliente ${req.params.id}` });
});
