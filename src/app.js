import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from 'url';
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

// Configs
import { env } from "./config/env.js";
import { conectarDB } from "./config/db.js";
import { iniciarPassport } from "./config/passport.config.js";

// Routers API
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as clientesRouter } from "./routes/clientesRouter.js";
import { router as cookiesRouter } from "./routes/cookiesRouter.js";
import { router as sessionsRouter } from "./routes/sessionsRouter.js";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as cartsRouter } from "./routes/cartsRouter.js";
import { router as ticketsRouter } from "./routes/ticketsRouter.js";


// Routers vistas
import { router as viewsRouter } from "./routes/views.router.js";

import { logger } from "./middleware/log.js";
import sessions from "express-session";
import MongoStore from "connect-mongo";
import UserCurrentDTO from "./dto/userCurrent.dto.js";

import __dirname from "./utils.js";
const __filename = fileURLToPath(import.meta.url);

const app = express();
const PORT = env.PORT || 3000;

// 🔹 Seguridad
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 requests por IP
    message: "Demasiadas solicitudes, intenta más tarde",
  })
);

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "/public")));
app.use(logger);

app.use(
  sessions({
    secret: env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URL,
      dbName: env.DB_NAME,
      ttl: 3600,
    }),
  })
);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// Endpoints
app.use("/api/usuarios", usuariosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/", viewsRouter);

// 🔹 Passport
iniciarPassport();
app.use(passport.initialize());
app.use(passport.session()); // solo si usas sessions

// Middleware para pasar usuario a las vistas si está logueado
app.use((req, res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      // Solo exponemos datos seguros
      res.locals.user = new UserCurrentDTO(payload);
    } catch {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// 🔹 Middleware de errores
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Error interno del servidor",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});

conectarDB(env.MONGO_URL, env.DB_NAME);
