import { Router } from "express";
import { UsuariosManager } from "../dao/UsuariosManager.js";
import { auth } from "../middleware/auth.js";

export const router = Router();

router.get("/", (req, res) => {
  let usuarios = UsuariosManager.get();

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ payload: usuarios });
});

router.post("/", auth, (req, res) => {
  let { nombre, email } = req.body;
  if (!nombre || !email) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `nombre / email son requeridos` });
  }

  // resto validaciones pertinentes
  try {
    let nuevoUsuario = UsuariosManager.create({ nombre, email });

    res.setHeader("Content-Type", "application/json");
    return res
      .status(201)
      .json({ payload: nuevoUsuario, message: `Usuario generado con éxito` });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Error interno del servidor` });
  }
});

router.delete(
  "/:id",
  auth,
  (req, res) => {
    // let id=req.params.id
    let { id } = req.params;

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ payload: `Se eliminó el usuario con id ${id}` });
  }
);
