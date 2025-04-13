import {Router} from "express";
import { getMarcas, postMarcas } from "../controllers/marca.controllers.js";

const routerMarcas = Router();

routerMarcas.get('/marcas', getMarcas);

routerMarcas.post('/marcas', postMarcas);

export default routerMarcas;