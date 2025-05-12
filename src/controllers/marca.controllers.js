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
  
      const nombreEnUso = await pool.query(
        "SELECT * FROM marcas WHERE nombre_marca = $1",
        [nombre_marca]);

      if (nombreEnUso.rowCount > 0) {
          return res.status(403).json({message: `ya existe una marca llamada ${nombre_marca}`});
      }

      if (nombre_marca == ''){
        return res.status(400).json({message: "el nombre de marca no puede estar vacío"})
      }

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

      const marcaEnUso = await pool.query(
        "SELECT * FROM pieza WHERE id_marca = $1",
        [nombre_marca]);

      if (marcaEnUso.rowCount > 0) {
        return res.status(400).json({message: "la marca tiene piezas asociadas"});
      }

      const result = await pool.query(
        "DELETE FROM marcas WHERE id_marca = $1 RETURNING *",
        [nombre_marca]);

        if (result.rowCount === 0) {
          return res.status(404).json({message: "Marca no encontrada"});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error al eliminar marca:", error);
      res.status(500).send("Error interno del servidor");
    }
  };