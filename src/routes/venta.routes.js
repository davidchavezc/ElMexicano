import {Router} from "express";
import { getVentas } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/ventas', getVentas);

export default routerVenta;