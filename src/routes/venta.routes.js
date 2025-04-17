import {Router} from "express";
import { getPiezas } from "../controllers/venta.controllers.js";

const routerVenta = Router();

routerVenta.get('/venta', getPiezas);

export default routerVenta;