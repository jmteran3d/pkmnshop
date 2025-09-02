import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../dao/models/usuario.model.js";
import { auth } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { hashPassword, comparePassword } from '../utils/hash.js';
import { authJWT } from "../middleware/auth.js";


export const router = Router();

function buildUserPayload(usuario) {
  return {
    uid: usuario._id,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    email: usuario.email,
    age: usuario.age,
    role: usuario.role,
    cart: usuario.cart
  };
}

function signToken(usuario) {
  const payload = buildUserPayload(usuario);
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
}


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

// router.post(
//   "/registro",
//   // paso 3:
//   passport.authenticate("registro", { session: false, failureRedirect: "/api/sessions/error" }),
//   (req, res) => {
//     // si passport.authenticate sale OK, deja en la req una property user
//     // req.user

//     res.setHeader("Content-Type", "application/json");
//     return res
//       .status(200)
//       .json({
//         payload: `Registro exitoso para ${req.user.nombre}`,
//         usuarioGenerado: req.userS,
//       });
//   }
// );



//Registro
router.post('/registro', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: 'error', error: 'Campos obligatorios faltantes' });
    }
    const exists = await usuariosModelo.findOne({ email });
    if (exists) return res.status(409).json({ status: 'error', error: 'Email ya registrado' });

    const usuario = await usuariosModelo.create({
      first_name,
      last_name,
      email,
      age: age ?? 0,
      password: hashPassword(password),
      role: role ?? 'user'
    });

    return res.status(201).json({ status: 'success', payload: { _id: usuario._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', error: 'Error en registro' });
  }
});

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuariosModelo.findOne({ email });
    if (!usuario) return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });
    const ok = comparePassword(password, usuario.password);
    if (!ok) return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });

    const token = signToken(usuario);

    // cookie httpOnly
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 1 día
    });

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', error: 'Error en login' });
  }
});

// router.post(
//   "/login",
//   // paso 3
//   passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
//   (req, res) => {
//     // si passport.authenticate sale OK, deja en la req una property user
//     // req.user

//     const usuario = req.user;
//     const token = jwt.sign(
//       { uid: usuario._id, email: usuario.email },
//       config.JWT_SECRET,
//       { expiresIn: config.JWT_EXPIRES }
//     );

//     res.cookie(config.COOKIE_NAME, token, { httpOnly: true, secure: false })
//       .redirect("/perfil");
//   }
// );

// Logout

// Current -> requiere JWT válido (header o cookie)
router.get('/current', authJWT, async (req, res) => {
  return res.json({ status: 'success', usuario: req.user });
});

// Logout -> borra cookie
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.json({ status: 'success', message: 'Sesión cerrada' });
});



// router.get("/logout", (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       res.setHeader("Content-Type", "application/json");
//       return res
//         .status(500)
//         .json({ error: `Error en proceso de logout... :(` });
//     }

//     // res.setHeader('Content-Type','application/json');
//     // return res.status(200).json({payload:`Logout exitoso`});
//     res.redirect("/login");
//   });
// });

// Perfil protegido
router.get("/perfil", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res
    .status(200)
    .json({ payload: "datos...", usuario: req.user });
});
