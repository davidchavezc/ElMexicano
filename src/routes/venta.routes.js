import {Router} from "express";
import { getPiezas } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/ventas', getPiezas);

export default routerVenta;