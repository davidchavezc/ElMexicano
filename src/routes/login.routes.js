import {Router} from "express";

const routerLogin = Router();

routerLogin.post('/post', postLogin);

export default routerLogin;