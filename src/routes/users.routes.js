import {Router} from "express";
import {pool} from '../db.js';

const router = Router();

router.get("/usuarios", async (req, res) => {
    const result= await pool.query("SELECT * FROM usuario");
    console.log(result);
    
});

export default router;