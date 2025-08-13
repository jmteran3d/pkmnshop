import express from "express";
import { logger } from "./middleware/log.js";
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as clientesRouter } from "./routes/clientesRouter.js";
import { router as cookiesRouter } from "./routes/cookiesRouter.js";
import { router as sessionsRouter } from "./routes/sessions.router.js";
import { router as productsRouter } from "./routes/products.router.js";
import { router as viewsRouter } from "./routes/views.router.js";
import { conectarDB } from "./config/db.js";
import { config } from "./config/config.js";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import path from "path";
import passport from "passport";
import { iniciarPassport } from "./config/passport.config.js";

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
    secret: config.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      dbName: config.DB_NAME,
      //collectionName:"pruebas",
      ttl: 3600,
    }),
  })
);

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

const server = app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});

conectarDB(config.MONGO_URL, config.DB_NAME);
