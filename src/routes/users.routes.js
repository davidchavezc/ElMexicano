import {Router} from "express";
import {pool} from '../db.js';
import { getUsuarios } from "../controllers/users.controllers.js";

const routerUsuarios = Router();

routerUsuarios.get('/usuarios', getUsuarios);

export default routerUsuarios;