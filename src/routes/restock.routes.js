import {Router} from "express";
import {pool} from '../db.js';
import { getPiezas, updatePiezas } from "../controllers/restock.controllers.js";

const routerRestock = Router();

routerRestock.get('/piezas', getPiezas);

routerRestock.put('/piezas', updatePiezas);

export default routerRestock;