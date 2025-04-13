import {Router} from "express";
import { getMarcas } from "../controllers/marca.controllers";

const routerMarcas = Router();

routerMarcas.get('/marcas', getMarcas);

export default routerMarcas;