import {Router} from "express";
import { getPiezaById, getPiezas } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/ventas', getPiezas);
routerVenta.get('/ventas/:id', getPiezaById);

export default routerVenta;