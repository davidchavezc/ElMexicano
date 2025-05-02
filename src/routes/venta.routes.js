import {Router} from "express";
import { getPiezaById, getPiezas, postVenta, getMetodoPago } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/ventas', getPiezas);
routerVenta.get('/ventas', getPiezaById);
routerVenta.post('/ventas', postVenta);
routerVenta.get('/ventas/metodoPago', getMetodoPago);

export default routerVenta;