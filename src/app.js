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
import fs from "fs";
import multer from "multer";
const port =3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use('/img', express.static(path.join(__dirname, '../img')));
// Set EJS as the view engine
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

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

app.get("/logOut", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Configura multer para guardar archivos en /img
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../img");
    // Crea la carpeta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Sanitiza el título para usarlo como nombre de archivo
    let title = req.body.title || "untitled";
    title = title.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const ext = path.extname(file.originalname);
    // Agrega el timestamp para evitar sobrescribir archivos
    cb(null, `${title}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: storage });

// Endpoint para subir imagen
app.post('/media', upload.single('pic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Devuelve la ruta relativa para usar en el frontend
  res.json({ path: `/img/${req.file.filename}` });
})

// Endpoint para obtener imágenes
app.get('/media', (req, res) => {
  const dir = path.join(__dirname, "../img");
  fs.readdir(dir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo leer la carpeta de imágenes" });
    }
    // Solo archivos que sean imágenes (opcional)
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file)
    );
    res.json({ images: imageFiles });
  });
});

// Rutas para usuarios
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});


app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

app.get("/error", (req, res) => {
  res.render("error", { user: req.user });
});

app.get("/teapot", (req, res) => {
  res.render("teapot", { user: req.user })
})

app.get("/nosotros", (req, res) => {
  res.render("nosotros", { user: req.user });
});

app.get("/catalogo", (req, res) => {
  res.render("catalogo", { user: req.user });
});

app.get("/detalle", (req, res) => {
  res.render("detalle", { user: req.user });
});

// Rutas para pantallas de empleado
app.get(["/empleado/venta", "/venta", "/empleado"], (req, res) => {
  res.render("empleado/venta", { user: req.user });
});

app.get(["/empleado/restock", "/restock"], (req, res) => {
  res.render("empleado/restock", { user: req.user });
});

// Rutas para administrador
app.get("/admin", (req, res) => {
  res.render("admin/reporte", { user: req.user });
});

app.get(["/admin/empleados"], (req, res) => {
  res.render("admin/empleados", { user: req.user });
});

app.get(["/admin/historial"], (req, res) => {
  res.render("admin/historial", { user: req.user });
});

app.get(["/admin/marcas"], (req, res) => {
  res.render("admin/marcas", { user: req.user });
});

app.get("/admin/pictures", (req, res) => {
  res.render("pictures", { user: req.user })
})

app.get(["/admin/modelos"], (req, res) => {
  res.render("admin/modelos", { user: req.user });
});

app.get(["/admin/piezas"], (req, res) => {
  res.render("admin/piezas", { user: req.user });
});

app.get(["/admin/reporte"], (req, res) => {
  res.render("admin/reporte", { user: req.user });
});

app.get(["/admin/categoria"], (req, res) => {
  res.render("admin/categoria", { user: req.user });
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

app.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect("/teapot"); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // Redirección según el rol
      if (user.id_rol === 1) {
        return res.redirect("/admin");
      } else if (user.id_rol === 2) {
        return res.redirect("/empleado/venta");
      } else {
        return res.redirect("/");
      }
    });
  })(req, res, next);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

