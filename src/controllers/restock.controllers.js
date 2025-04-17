import {pool} from '../db.js'

export const getPiezas = async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM pieza");
        res.json(result.rows); 
    }
    catch{
        console.error("Error al obtener piezas:", error);
        res.status(500).send("Error interno del servidor");
    }

}

export const updatePiezas = async (req,res) => {
    try{
        const result = await pool.query("UPDATE pieza SET cantidad = $1 WHERE id = $2 RETURNING *", [cantidad,id]);
        res.json(result.rows); 
    }
    catch{
        console.error("Error al actualizar piezas:", error);
        res.status(500).send("Error interno del servidor");
    }

}