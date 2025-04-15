import {pool} from '../db.js'

export const getPiezas = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pieza");
        res.json(result.rows); 
    } catch (error) {
        console.error("Error al obtener piezas:", error);
        res.status(500).send("Error interno del servidor");
    }
};