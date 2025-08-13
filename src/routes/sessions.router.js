import { Router } from "express";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../models/usuario.model.js";
import { auth } from "../middleware/auth.js";
import passport from "passport";

export const router = Router();

// router.post("/registro", async (req, res) => {
//   // validaciones...
//   let { nombre, apellido, email, password } = req.body;
//   if (!nombre || !apellido || !email || !password) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(400).json({ error: `Todos los datos son requeridos` });
//   }

//   // resto validaciones

//   try {
//     password = bcrypt.hashSync(password, 10);

//     let nuevoUsuario = await usuariosModelo.create({
//       nombre,
//       apellido,
//       email,
//       password,
//     });

//     res.setHeader("Content-Type", "application/json");
//     res
//       .status(200)
//       .json({ message: `Registro exitoso para ${nombre}!`, nuevoUsuario });
//   } catch (error) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(500).json({ error: `Error: ${error.message}` });
//   }
// });

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(400).json({ error: `Error al autenticar...` });
});

router.post(
  "/registro",
  // paso 3:
  passport.authenticate("registro", { failureRedirect: "/api/sessions/error" }),
  (req, res) => {
    // si passport.authenticate sale OK, deja en la req una property user
    // req.user

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({
        payload: `Registro exitoso para ${req.user.nombre}`,
        usuarioGenerado: req.userS,
      });
  }
);

// Login
// router.post("/login", async (req, res) => {
//   let { email, password } = req.body;
//   if (!email || !password) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(400).json({ error: `email y password son requeridos` });
//   }

//   try {
//     let usuario = await usuariosModelo.findOne({ email }).lean();
//     if (!usuario) {
//       res.setHeader("Content-Type", "application/json");
//       return res.status(401).json({ error: `Credenciales inválidas` });
//     }

//     if (!bcrypt.compareSync(password, usuario.password)) {
//       res.setHeader("Content-Type", "application/json");
//       return res.status(401).json({ error: `Credenciales inválidas` });
//     }

//     delete usuario.password; // eliminar datos sensibles
//     req.session.usuario = usuario;

//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({ payload: `Login correcto!`, usuario });
//   } catch (error) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(500).json({ error: `Error: ${error.message}` });
//   }
// });

router.post(
  "/login",
  // paso 3
  passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
  (req, res) => {
    // si passport.authenticate sale OK, deja en la req una property user
    // req.user

    req.session.usuario = req.user;

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ payload: `Login exitoso para ${req.user.nombre}` });
  }
);

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
