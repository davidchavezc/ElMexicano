import { pool } from '../db.js';

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
        console.log("Datos recibidos:", req.body); // Para depuración
        const { nombre_pieza, id_modelo, id_marca, id_categoria, cantidad, precio } = req.body;

        // Validar que todos los campos necesarios estén presentes
        if (!nombre_pieza || !id_modelo || !id_marca || !id_categoria || !cantidad) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos", 
                required: ["nombre_pieza", "id_modelo", "id_marca", "id_categoria", "cantidad"],
                received: req.body 
            });
        }

        const result = await pool.query(
            "INSERT INTO pieza (nombre_pieza, id_modelo, id_marca, id_categoria, cantidad, precio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [nombre_pieza, id_modelo, id_marca, id_categoria, cantidad, precio || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error("Error al crear pieza: ", error);
        res.status(500).json({ message: "Error al crear pieza: " + error.message });
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

// Obtener piezas por marca
export const obtenerPiezasPorMarca = async (req, res) =>{
    try{
        const {id_marca} = req.params;
        const result = await pool.query(
            "SELECT * FROM pieza WHERE id_marca = $1", [id_marca]
        );
        res.json(result.rows);
    } catch (error){
        console.error("Error al obtener piezas por marca: ", error);
        res.status(500).json({ message: "Error al obtener piezas por marca" });
    }
};

// Obtener piezas por modelo
export const getPiezasPorModelo = async (req, res) => {
    try {
        const { id_modelo } = req.params;
        const result = await pool.query(
            "SELECT * FROM pieza WHERE id_modelo = $1", [id_modelo]
        );
        res.json(result.rows); 
    } catch (error){
        console.error("Error al obtener piezas por modelo: ", error);
        res.status(500).json({ message: "Error al obtener piezas por modelo" });
    }
};

// Obtener piezas por categoría
export const getPiezasPorCategoria = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const result = await pool.query(
            "SELECT * FROM pieza WHERE id_categoria = $1", 
            [id_categoria]
        );
        res.json(result.rows);
    } catch (error){
        console.error("Error al obtener piezas por categoría: ", error);
        res.status(500).json({ message: "Error al obtener piezas por categoría" });
    }
};

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categoria ORDER BY id_categoria");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener categorías: ", error);
        res.status(500).json({ message: "Error al obtener categorías" });
    }
};

// Función para filtrar piezas por marca, modelo y/o categoría
export const filtrarPiezas = async (req, res) => {
    try {
        const { marca, modelo, categoria } = req.query;
        
        console.log("Parámetros recibidos:", { marca, modelo, categoria });
        
        // Construir la consulta SQL con los filtros
        let query = "SELECT * FROM pieza WHERE 1=1";
        const params = [];
        let paramIndex = 1;
        
        if (marca) {
            query += ` AND id_marca = $${paramIndex}`;
            params.push(parseInt(marca, 10)); // Convertir a número
            paramIndex++;
        }
        
        if (modelo) {
            query += ` AND id_modelo = $${paramIndex}`;
            params.push(parseInt(modelo, 10)); // Convertir a número
            paramIndex++;
        }
        
        if (categoria) {
            query += ` AND id_categoria = $${paramIndex}`;
            params.push(parseInt(categoria, 10)); // Convertir a número
            paramIndex++;
        }
        
        console.log("Consulta SQL:", query);
        console.log("Parámetros:", params);
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al filtrar piezas:", error);
        res.status(500).json({ message: "Error al filtrar piezas: " + error.message });
    }
};