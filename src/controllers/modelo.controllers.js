import { pool } from "../db.js";

// Obtener todos los modelos
export const getModelos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM modelos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    res.status(500).json("Error al obtener modelos del servidor");
  }
};

// Obtener modelo por ID
export const getModeloPorId = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM modelo WHERE id_modelo $1", [id]);
        
        if(result.rows.lenght === 0){
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
        const {nombre, id_marca} = req.body;

        const result = await pool.query("INSERT INTO modelo (nombre, id_marca) VALUES ($1, $2) RETURNING *"
            [nombre, id_marca]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error("Error al crear modelo: ", error);
        res.status(500).json({ message: "Error al crear modelo" });
    }
};