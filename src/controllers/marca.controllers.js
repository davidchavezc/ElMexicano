import {pool} from '../db.js'

export const getMarcas = async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM marcas");
        res.json(result.rows); 
    }
    catch{
        console.error("Error al obtener marcas:", error);
        res.status(500).send("Error interno del servidor");
    }

}

export const postMarcas = async (req, res) => {
    try {
      const { nombre_marca } = req.body;
  
      const result = await pool.query(
        "INSERT INTO marcas (nombre_marca) VALUES ($1) RETURNING *",
        [nombre_marca]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear marca:", error);
      res.status(500).send("Error interno del servidor");
    }
  };

  export const eliminaMarcas = async (req, res) => {
    try {
      const{nombre_marca}=req.body;

      const result = await pool.query(
        "DELETE FROM marcas WHERE nombre_marca = $1 RETURNING *",
        [nombre_marca]);
    } catch (error) {
      console.error("Error al eliminar marca:", error);
      res.status(500).send("Error interno del servidor");
    }
  };