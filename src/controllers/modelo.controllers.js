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