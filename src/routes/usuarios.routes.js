import {Router} from "express";
import {pool} from '../db.js';
import { getUsuarios } from "../controllers/usuarios.controllers.js";

const routerUsuarios = Router();

routerUsuarios.get('/usuarios', getUsuarios);

export default routerUsuarios;