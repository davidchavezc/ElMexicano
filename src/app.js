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
import routerReporte from "./routes/reporte.routes.js";
import passport from "passport";
import { pool } from './db.js';
import { Strategy as LocalStrategy } from 'passport-local';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port =3000;

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

passport.use(
      // console.log('Reached')
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log('Reached')
      const { rows } = await pool.query("SELECT * FROM usuario WHERE usuario_empleado = $1", [username]);
      const user = rows[0];
      console.log(user)

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.contrasena_empleado !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id_empleado);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuario WHERE id_empleado = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Rutas para usuarios
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/login.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/error.html"));
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
app.use("/", routerReporte);

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/error"
  })
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

