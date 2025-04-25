import { Router } from "express";
import { getPiezaById, getPiezas, updatePiezas } from "../controllers/detalleDePiezas.controllers.js";

const routerPiezas = Router();

routerPiezas.get('/Piezas', getPiezas);
routerPiezas.get('/Piezas/:id', getPiezaById);
routerPiezas.put('/piezas', updatePiezas);

export default routerPiezas;