import express from "express";
import session from 'express-session';
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import routerUsuarios from "./routes/usuarios.routes.js";
import routerMarcas from "./routes/marca.routes.js";
import routerVenta from "./routes/venta.routes.js";
import routerCategorias from "./routes/categorias.routes.js";
import routerLogin from "./routes/login.routes.js";
import routerModelos from "./routes/modelo.routes.js";
import routerDePiezas from "./routes/pieza.routes.js";
import routerHistorial from "./routes/historial.routes.js";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port =3000;

app.use(session({
  secret: process.env.DB_PASSWORD,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Rutas para usuarios
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/login.html"));
});

app.get("/nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/nosotros.html"));
});

app.get("/catalogo", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/catalogo.html"));
});

app.get("/producto", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/producto.html"))
});

// Rutas para pantallas de empleado
app.get(["/empleado/venta", "/venta", "/empleado"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/empleado/venta.html"));
});

app.get(["/empleado/restock", "/restock"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/empleado/restock.html"));
});

// Rutas para administrador
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/reporte.html"));
});

app.get(["/admin/empleados"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/empleados.html"))
});

app.get(["/admin/historial"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/historial.html"))
});

app.get(["/admin/marcas"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/marcas.html"))
});

app.get(["/admin/modelos"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/modelos.html"))
});

app.get(["/admin/piezas"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/piezas.html"))
});

app.get(["/admin/reporte"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/reporte.html"))
});

app.get(["/admin/categoria"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/categoria.html"))
});

// Routers

app.use("/", routerUsuarios);
app.use("/", routerMarcas);
app.use("/", routerModelos);
app.use("/", routerVenta);
app.use("/", routerCategorias);
app.use("/", routerLogin);
app.use("/", routerDePiezas);
app.use("/", routerHistorial);





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

