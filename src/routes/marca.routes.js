import {Router} from "express";
import { eliminaMarcas, getMarcas, postMarcas } from "../controllers/marca.controllers.js";

const routerMarcas = Router();

routerMarcas.get('/marcas', getMarcas);

routerMarcas.post('/marcas', postMarcas);

routerMarcas.delete('/marcas', eliminaMarcas);

export default routerMarcas;