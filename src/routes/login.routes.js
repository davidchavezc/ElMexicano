import {Router} from "express";
import { postLogin } from "../controllers/login.controllers.js";

const routerLogin = Router();

routerLogin.post('/login', postLogin);

export default routerLogin;