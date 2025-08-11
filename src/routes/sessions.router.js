import { Router } from "express";
import { auth } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../models/usuario.model.js";

export const router = Router();

router.post("/registro", async (req, res) => {
  // validaciones...
  let { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Todos los datos son requeridos` });
  }

  // resto validaciones

  try {
    password = bcrypt.hashSync(password, 10);

    let nuevoUsuario = await usuariosModelo.create({
      nombre,
      apellido,
      email,
      password,
    });

    res.setHeader("Content-Type", "application/json");
    res
      .status(200)
      .json({ message: `Registro exitoso para ${nombre}!`, nuevoUsuario });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Error: ${error.message}` });
  }
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `email y password son requeridos` });
  }

  try {
    let usuario = await usuariosModelo.findOne({ email }).lean();
    if (!usuario) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales inválidas` });
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales inválidas` });
    }

    delete usuario.password; // eliminar datos sensibles
    req.session.usuario = usuario;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: `Login correcto!`, usuario });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Error: ${error.message}` });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: `Error en proceso de logout... :(` });
    }

    // res.setHeader('Content-Type','application/json');
    // return res.status(200).json({payload:`Logout exitoso`});
    res.redirect("/login");
  });
});

// Perfil protegido
router.get("/perfil", auth, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res
    .status(200)
    .json({ payload: "datos...", usuario: req.session.usuario });
});
