import express from "express";
import { logger } from "./middleware/log.js";
import { router as usuariosRouter } from "./routes/usuariosRouter.js";
import { router as clientesRouter } from "./routes/clientesRouter.js";
import { conectarDB } from "./config/db.js";
import { config } from "./config/config.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(logger);

// Endpoints
app.use("/api/usuarios", usuariosRouter);
app.use("/api/clientes", clientesRouter);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "OK" });
});

const server = app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});

conectarDB(
    config.MONGO_URL,
    config.DB_NAME
)