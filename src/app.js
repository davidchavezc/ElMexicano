import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import {port} from './config.js';
import routerUsuarios from "./routes/usuarios.routes.js";
import routerMarcas from "./routes/marca.routes.js";
import routerVenta from "./routes/venta.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/" , routerUsuarios);
app.use("/", routerMarcas);
app.use("/", routerVenta);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});