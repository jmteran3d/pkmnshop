import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from 'url';


import { conectarDB } from "./config/db.js";
import { env } from "./config/env.js";
import { iniciarPassport } from "./config/passport.config.js";

// Routers API
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as clientesRouter } from "./routes/clientesRouter.js";
import { router as cookiesRouter } from "./routes/cookiesRouter.js";
import { router as sessionsRouter } from "./routes/sessions.router.js";
import { router as productsRouter } from "./routes/products.router.js";

// Routers vistas
import { router as viewsRouter } from "./routes/views.router.js";

import { logger } from "./middleware/log.js";
import sessions from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";

const __filename = fileURLToPath(import.meta.url);
import __dirname from "./utils.js";

const PORT = process.env.PORT || 3000;
const app = express();
//const filestore = FileStore(sessions);

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("coderpass"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(logger);
app.use(
  sessions({
    secret: env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URL,
      dbName: env.DB_NAME,
      //collectionName:"pruebas",
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
app.use("/", viewsRouter);

// paso 2:
iniciarPassport();
app.use(passport.initialize());
app.use(passport.session()); // solo si uso sessions
app.use((error, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(500).json({ error: `Error: ${error.message}` });
});

// Middleware para pasar usuario a las vistas si está logueado
app.use((req, res, next) => {
  // Si el token está en cookie, lo decodificamos manualmente para mostrar en la UI
  const jwt = req.cookies?.jwt;
  if (jwt) {
    try {
      const payload = JSON.parse(
        Buffer.from(jwt.split('.')[1], 'base64').toString('utf-8')
      );
      res.locals.user = payload;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

const server = app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});

conectarDB(env.MONGO_URL, env.DB_NAME);
