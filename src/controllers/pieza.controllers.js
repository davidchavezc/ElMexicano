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

// Crear una pieza nueva
export const postCrearPieza = async (req, res) => {
    try {
        const { nombre_pieza, id_modelo, id_marca, id_categoria, cantidad } = req.body;

        const result = await poolquery(
            "INSERT INTO pieza ( nombre_pieza, id_modelo, id_marca, id_categoria, cantidad) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nombre_pieza,id_modelo, id_marca, id_categoria, cantidad]
        );

        res.status(201).json(result.rows[0]);
    } catch ( error){
        console.error("Error al crear pieza: ", error);
        res.status(500).json({ message: "Error al crear pieza."});
    }
} 

// Actualizar pieza
export const actualizarPieza = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_pieza, id_modelo, id_categoria, cantidad } = req.body;

        const result = await pool.query(
            "UPDATE pieza SET nombre_pieza = $1, id_modelo = $2, id_categoria = $3, id_categoria = $4, cantidad = $5, WHERE id_pieza = $6 RETURNING *",
            [nombre_pieza, id_modelo, id_categoria, cantidad, id]
        );

        if (result.rows.length === 0){
            return res.status(404).json({ message: "Pieza no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error){
        console.error("Error al actualizar pieza: ", error);
        res.status(500).json({ message: "Error al actualizar pieza" });
    }
}

// Eliminar pieza 
export const eliminarPieza = async (req, res) => {
    try{
        const { id } = req.params;
        
        const result = await pool.query("DELETE FROM pieza WHERE id_pieza = $1 RETURNING *", [id]);

        if (result.rows.length === 0){
            return res.status(404).json({ message: "Pieza no encontrada" });
        }
        res.json({ message: "Pieza eliminada exitosamente", pieza: result.rows[0] });
    } catch (error){
        console.error("Error al eliminar pieza: ", error);
        res.status(500).json({ message: "Error al eliminar pieza" });
    }
};

// Actualizar cantidad de piezas para restock
export const actualizarCantidadPieza = async (req, res) => {
    try{
        const { id }= req.params;
        const {cantidad} = req.body;

        const result = await pool.query(
            "UPDATE pieza SET cantidad =  cantidad + $1 WHERE id_pieza = $2 RETURNING *",
            [cantidad, id]
        );

        if (result.rows.length === 0){
            return res.status(404).json({ message: "Pieza no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error){
        console.error("Error al actualizar cantidad de piezas: ", error);
        res.status(500).json({ message: "Error al actualizar cantidad de piezas" });
    }
};