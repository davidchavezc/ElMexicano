import {Router} from "express";
import { postLogin } from "../controllers/login.controllers.js";

const routerLogin = Router();

routerLogin.post('/login', postLogin);

routerLogin.get('/logOut', logOut);

export default routerLogin;