// src/routes/sessionsRouter.js
import { Router } from "express";

export const router = Router();

// Ejemplo contador en session
router.get("/", (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
    } else {
        req.session.contador = 1;
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: `Visitas: ${req.session.contador}` });
});

// Simulación login
router.post("/login", (req, res) => {
    const usuarios = [
        { id: 1, nombre: "Luciana", email: "luciana@test.com", password: "123", rol: "user" },
        { id: 2, nombre: "Juan", email: "juan@test.com", password: "123", rol: "user" },
        { id: 3, nombre: "Romina", email: "romina@test.com", password: "123", rol: "admin" },
    ];

    let { email, password } = req.body;
    if (!email || !password) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `email | password son requeridos` });
    }

    let usuario = usuarios.find(u => u.email === email && u.password === password);
    if (!usuario) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: `Credenciales inválidas` });
    }

    req.session.usuario = usuario;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: `Login exitoso`, usuarioLogueado: usuario });
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({ error: `fallo en logout` });
        }

        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "Logout exitoso" });
    });
});

// Middleware de auth (opcional)
function auth(req, res, next) {
    if (!req.session.usuario) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: "No autorizado" });
    }
    next();
}

// Perfil protegido
router.get("/perfil", auth, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "datos...", usuario: req.session.usuario });
});
