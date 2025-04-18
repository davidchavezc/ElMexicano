import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import {port} from './config.js';
import routerUsuarios from "./routes/usuarios.routes.js";
import routerMarcas from "./routes/marca.routes.js";
import routerVenta from "./routes/venta.routes.js";
import routerRestock from "./routes/restock.routes.js";
import routerCategorias from "./routes/categorias.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/reporte.html"));
});

app.use("/", routerUsuarios);
app.use("/", routerMarcas);
app.use("/", routerVenta);
app.use("/", routerRestock);
app.use("/", routerCategorias);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});