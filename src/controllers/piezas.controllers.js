import { pool } from '../db.js'

export const getPiezas = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM pieza");
        res.json(result.rows);
    }
    catch{
        console.error("Error al obtener pieza:", error);
        res.status(500).send("Error interno del servidor");
    }
}

export const getPiezaById = async (req, res) => {
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM pieza WHERE id_pieza=$1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Pieza no encontrada');
          }
        res.json(result.rows[0]);
    }
    catch(error){
        console.error("Error al obtener pieza:", error);
        res.status(500).send("Error interno del servidor");
    }
}