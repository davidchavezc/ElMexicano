import {pool} from '../db.js'

export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuario");
        res.json(result.rows); 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error interno del servidor");
    }
};