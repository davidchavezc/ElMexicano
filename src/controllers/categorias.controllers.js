import { pool } from '../db.js'

export const getCategorias = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM categoria");
        res.json(result.rows);
    }
    catch{
        console.error("Error al obtener categoria:", error);
        res.status(500).send("Error interno del servidor");
    }
}

export const postCategoria = async (req, res) => {
    try {
      const { nombre } = req.body;
      
      const nombreEnUso = await pool.query(
        "SELECT * FROM categoria WHERE nombre_categoria = $1",
        [nombre]);

      if (nombreEnUso.rowCount > 0) {
          return res.status(403).json({message: `ya existe una categoria llamada ${nombre}`});
      }

      if (nombre == ''){
        return res.status(400).json({message: "el nombre de la categoria no puede estar vacío"})
      }

      const result = await pool.query(
        "INSERT INTO categoria (nombre_categoria) VALUES ($1) RETURNING *",
        [nombre]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear categoria:", error);
      res.status(500).send("Error interno del servidor");
    }
  };

  export const eliminaCategoria = async (req, res) => {
    try {
      const{id}=req.body;

      const marcaEnUso = await pool.query(
        "SELECT * FROM pieza WHERE id_categoria = $1",
        [id]);

      if (marcaEnUso.rowCount > 0) {
        return res.status(400).json({message: "la categoria tiene piezas asociadas"});
      }

      const result = await pool.query(
        "DELETE FROM categoria WHERE id_categoria = $1 RETURNING *",
        [id]);

        if (result.rowCount === 0) {
          return res.status(404).json({message: "Categoría no encontrada"});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      res.status(500).send("Error interno del servidor");
    }
  };