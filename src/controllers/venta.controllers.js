import {pool} from '../db.js'

export const getVentas = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error al obtener piezas:", error);
        res.status(500).send("Error interno del servidor");
    }
};