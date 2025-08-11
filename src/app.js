import express from "express";
import { logger } from "./middleware/log.js";
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as clientesRouter } from "./routes/clientesRouter.js";
import { router as cookiesRouter } from "./routes/cookiesRouter.js";
import { router as sessionsRouter } from "./routes/sessionsRouter.js";
import { conectarDB } from "./config/db.js";
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import { router as productsRouter } from './routes/products.router.js';

const PORT = process.env.PORT || 3000;
const app = express();
const filestore = FileStore(sessions);

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("coderpass"));
app.use(express.static("./src/public"));
app.use(logger);
app.use(
  sessions({
    secret: "coderpass",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create(
        {
            mongoUrl: "mongodb+srv://jmcoder:coderpass@backend2.uixncin.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Backend2",
            dbName: "myEcommerce",
            collectionName:"pruebas", 
            ttl: 3600
        })
  }));

// Endpoint Raiz
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "OK" });
});

// Endpoints
app.use("/api/usuarios", usuariosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter)

const server = app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});

conectarDB(config.MONGO_URL, config.DB_NAME);
