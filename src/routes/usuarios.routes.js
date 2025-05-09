import { Router } from "express";
import {
  agregarUsuario,
  getUsuarios,
  editarUsuario,
  eliminarUsuario,
} from "../controllers/usuarios.controllers.js";

const routerUsuarios = Router();

// Endpoint para obtener los usuarios
routerUsuarios.get("/usuarios", getUsuarios);

// Endpoint para agregar usuarios
routerUsuarios.post("/usuarios", agregarUsuario);

// Endpoint para editar usuarios
routerUsuarios.put("/usuarios/:id", editarUsuario);

// Endpoint para eliminar usuarios
routerUsuarios.delete("/usuarios/:id", eliminarUsuario);

export default routerUsuarios;