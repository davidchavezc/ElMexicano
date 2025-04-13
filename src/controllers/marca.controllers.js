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

export const postMarcas = async (req,res) => {
    try{
        const result = await pool.query("INSERT INTO marcas");
        res.json(result.rows); 
    }
    catch{
        console.error("Error al crear marca:", error);
        res.status(500).send("Error interno del servidor");
    }

}