import { pool } from '../db.js'

export const getCategorias = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM categoria");
        res.json(result.rows);
    }
    catch{
        console.error("Error al obtener categorias:", error);
        res.status(500).send("Error interno del servidor");
    }
}