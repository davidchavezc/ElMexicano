import { Router } from "express";
import { obtenerHistorial, filtrarPorFecha } from "../controllers/historial.controllers.js";

const routerHistorial = Router();

routerHistorial.get("/", obtenerHistorial);
routerHistorial.get("/filtrar", filtrarPorFecha);

export default routerHistorial;
