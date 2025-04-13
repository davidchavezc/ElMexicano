import {pool} from '../db.js'

export const getMarcas = async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM marcas");
        res.json(result.rows); 
    }
    catch{
        console.error("Error al obtener marcas:", error);
        res.status(500).send("Error interno del servidor");
    }

}