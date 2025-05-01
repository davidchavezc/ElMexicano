import {Router} from "express";
import { getPiezaById, getPiezas, postVenta } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/ventas', getPiezas);
routerVenta.get('/ventas/:id', getPiezaById);
routerVenta.post('/ventas', postVenta);

export default routerVenta;