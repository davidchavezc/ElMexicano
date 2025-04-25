import { pool } from '../db,js';

// Obtener todas las piezas
export const getObtenerPieza = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pieza");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener las piezas: ", error);
        res.status (500).json({ message: "Error al obtener las piezas" });
    }
};

// Obtener una pieza por ID
export const getObtenerPiezaPorId = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM pieza WHERE id_pieza = $1", [id]);
        if (result.rows.length === 0){
            return res.status(404).json({ message: "Pieza no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error){
        console.error("Error al obtener pieza: ", error);
        res.status(500).json({ message: "Error al obtener pieza" });
    }
};

