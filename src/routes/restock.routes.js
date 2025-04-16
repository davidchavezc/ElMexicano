import {Router} from "express";
import {pool} from '../db.js';
import { getPiezas } from "../controllers/restock.controllers.js";

const routerRestock = Router();

routerRestock.get('/restock', getPiezas);

export default routerRestock;