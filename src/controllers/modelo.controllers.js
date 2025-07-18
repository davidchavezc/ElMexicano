import { pool } from "../db.js";

// Obtener todos los modelos
export const getModelos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM modelos");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener modelos:", error);
        res.status(500).json({ message: "Error al obtener modelos" });
    }
};

// Obtener modelo por ID
export const getModeloPorId = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM modelos WHERE id_modelo = $1", [id]);
        
        if(result.rows.length === 0){
            return res.status(404).json({ message: "Modelo no encontrado"});
        }
        
        res.json(result.rows[0]);
    }catch(error){
        console.error("Error al obtener modelo: ", error);
        res.status(500).json({message: "Error al obtener modelo"});
    }
};

// Crear modelo
export const crearModelo = async (req, res)=>{
    try{
        const {nombre_modelo, anio_modelo, id_marca} = req.body;

        const result = await pool.query("INSERT INTO modelos (nombre_modelo, anio_modelo, id_marca) VALUES ($1, $2, $3) RETURNING *",
            [nombre_modelo, anio_modelo, id_marca]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error("Error al crear modelo: ", error);
        res.status(500).json({ message: "Error al crear modelo" });
    }
};

// Actualizar modelo
export const updateModelo = async (req, res) =>{
    try{
        const { id } = req.params;
        const { nombre_modelo, anio_modelo, id_marca } = req.body;

        const result = await pool.query(
            "UPDATE modelos SET nombre_modelo = $1, anio_modelo = $2, id_marca = $3 WHERE id_modelo = $4 RETURNING *",
            [nombre_modelo, anio_modelo, id_marca, id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({
                message: "Modelo no encontrado"
            });
        }
        res.json(result.rows[0]);
    } catch (error){
        console.error("Error al actualizar modelo: ", error);
        res.status(500).json({ message: "Error al actualizar modelo" });
    }
}; 

// Eliminar modelo
export const deleteModelo = async (req, res) =>{
    try{
        const {id} = req.params;

        const result = await pool.query("DELETE FROM modelos WHERE id_modelo = $1 RETURNING *",
            [id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ message: "Modelo no encontrado"});
        }
        res.json(result.rows[0]);
    } catch ( error ){
        console.error("Error al eliminar modelo: ", error);
        res.status(500).json({ message: "Error al eliminar modelo"});
    }
};

// Obtener modelos por marca
export const getModelosPorMarca = async (req, res) => {
    try {
        const { id_marca } = req.params;
        const result = await pool.query(
            "SELECT * FROM modelos WHERE id_marca = $1 ORDER BY nombre_modelo",
            [id_marca]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener modelos por marca: ", error);
        res.status(500).json({ message: "Error al obtener modelos por marca" });
    }
};

// Obtener modelos por marca y año
export const getModelosPorMarcaYAnio = async (req, res) => {
    try {
        const { id_marca, anio_modelo } = req.params;
        const result = await pool.query(
            "SELECT * FROM modelos WHERE id_marca = $1 AND anio_modelo = $2 ORDER BY nombre_modelo",
            [id_marca, anio_modelo]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener modelos por marca y año: ", error);
        res.status(500).json({ message: "Error al obtener modelos por marca y año" });
    }
};

export const eliminarModeloPorCampos = async (req, res) => {
    try {
        const { nombre_modelo, anio_modelo, id_marca } = req.body;
        const result = await pool.query(
            "DELETE FROM modelos WHERE nombre_modelo = $1 AND anio_modelo = $2 AND id_marca = $3 RETURNING *",
            [nombre_modelo, anio_modelo, id_marca]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Modelo no encontrado" });
        }
        res.json({ message: "Modelo eliminado correctamente", modelo: result.rows[0] });
    } catch (error) {
        console.error("Error al eliminar modelo por campos:", error);
        res.status(500).json({ message: "Error al eliminar modelo" });
    }
};