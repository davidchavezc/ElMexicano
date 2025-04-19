import {Router} from "express";
import { agregarUsuario, getUsuarios } from "../controllers/usuarios.controllers.js";

const routerUsuarios = Router();

//Endpoint para obtener a los usuarios 
routerUsuarios.get('/usuarios', getUsuarios);

// Endpoint para agregar un usuario
routerUsuarios.post("/usuarios", agregarUsuario);

export default routerUsuarios;