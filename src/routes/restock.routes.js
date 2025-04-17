import {Router} from "express";
import {pool} from '../db.js';
import { getPiezas, updatePiezas } from "../controllers/restock.controllers.js";

const routerRestock = Router();

routerRestock.get('/restock', getPiezas);

routerRestock.update('/restock', updatePiezas);

export default routerRestock;