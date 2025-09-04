import { Router } from "express";
import { authJWT } from "../middleware/auth.js";

export const router = Router();

// Página principal
router.get("/", (req, res) => {
  res.render("home", { user: res.locals.user, isLogin: !!res.locals.user });
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { isLogin: !!res.locals.user });
});

// Registro
router.get("/registro", (req, res) => {
  res.render("registro", { isLogin: !!res.locals.user });
});

// Perfil (protegido)
router.get("/perfil", authJWT, (req, res) => {
  const { first_name, last_name, email, age, role } = req.user;
  res.render("perfil", {
    user: { first_name, last_name, email, age, role },
    isLogin: true
  });
});

// Otros endpoints (productos, carrito)
router.get("/products", (req, res) => {
  res.render("products", { user: res.locals.user, isLogin: !!res.locals.user });
});

router.get("/cart/:cid", (req, res) => {
  res.render("cart", { user: res.locals.user, cartId: req.params.cid, isLogin: !!res.locals.user });
});
