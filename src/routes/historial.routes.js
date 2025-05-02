// historial.routes.js
import { Router } from "express";
import { obtenerHistorial, filtrarPorFecha } from "../controllers/historial.controllers.js";

const routerHistorial = Router();

routerHistorial.get("/api/historial", obtenerHistorial);        
routerHistorial.get("/api/historial/filtrar", filtrarPorFecha);  

export default routerHistorial;
