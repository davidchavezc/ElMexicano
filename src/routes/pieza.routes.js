import { Router } from "express";
import { getPiezaById, getPiezas } from "../controllers/piezas.controllers.js";

const routerPiezas = Router();

routerPiezas.get('/Piezas', getPiezas);
routerPiezas.get('/Piezas/:id', getPiezaById);

export default routerPiezas;