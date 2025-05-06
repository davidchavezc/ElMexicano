import { Router } from "express";
import { eliminaCategoria, getCategorias, postCategoria } from "../controllers/categorias.controllers.js";

const routerCategorias = Router();

routerCategorias.get('/categorias', getCategorias);
routerCategorias.post('/categorias', postCategoria);
routerCategorias.delete('/categorias', eliminaCategoria)

export default routerCategorias;