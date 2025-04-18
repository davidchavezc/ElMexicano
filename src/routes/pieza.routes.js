import { Router } from "express";
import { getPiezas } from "../controllers/piezas.controllers.js";

const routerPiezas = Router();

routerPiezas.get('/Piezas', getPiezas);

export default routerPiezas;