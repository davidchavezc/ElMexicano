import {Router} from "express";
import {pool} from '../db.js';
import { getUsuarios } from "../controllers/usuarios.controllers.js";

const routerVenta = Router();

routerVentas.get('/ventas', getVenta);

export default routerVenta;