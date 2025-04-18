import { Router } from "express";
import { getCategorias } from "../controllers/categorias.controllers.js";

const routerCategorias = Router();

routerCategorias.get('/categorias', getCategorias);

export default routerCategorias;