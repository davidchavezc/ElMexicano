import { pool } from '../db.js';

// Obtener todas las piezas
// export const getObtenerPieza = async (req, res) => {
//     try {
//         const result = await pool.query(`
//             SELECT  pieza.*,
//             categoria.nombre AS categoria_nombre,
//             marcas.nombre_marca AS marca_nombre,
//             modelos.nombre_modelo AS modelo_nombre
//             FROM pieza INNER JOIN categoria ON
//             pieza.id_categoria = categoria.id
//             INNER JOIN modelos ON
//             modelos.id_modelo = pieza.id_modelo
//             INNER JOIN marcas ON
//             marcas.id_marca = pieza.id_marca;`);
//         // console.log(result.rows);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Error al obtener las piezas: ", error);
//         res.status (500).json({ message: "Error al obtener las piezas" });
//     }
// };

export const getPiezas = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT pieza.*,
          marcas.nombre_marca AS marca_nombre,
          modelos.nombre_modelo AS modelo_nombre,
          categoria.nombre_categoria AS categoria_nombre
        FROM pieza 
        INNER JOIN marcas ON pieza.id_marca = marcas.id_marca
        INNER JOIN categoria ON pieza.id_categoria = categoria.id_categoria
        INNER JOIN modelos ON pieza.id_modelo = modelos.id_modelo;
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener piezas:", error);
      res.status(500).send("Error interno del servidor");
    }
};


// Obtener una pieza por ID
export const getPiezaById = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query(`
        SELECT pieza.*,
          marcas.nombre_marca AS marca_nombre,
          modelos.nombre_modelo AS modelo_nombre,
          categoria.nombre_categoria AS categoria_nombre
        FROM pieza 
        INNER JOIN marcas ON pieza.id_marca = marcas.id_marca
        INNER JOIN categoria ON pieza.id_categoria = categoria.id_categoria
        INNER JOIN modelos ON pieza.id_modelo = modelos.id_modelo WHERE id_pieza = $1`, [id]);
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
        const { nombre_pieza, descripcion, id_modelo, id_marca, id_categoria, cantidad, precio, imagen} = req.body;

        // Validar que todos los campos necesarios estén presentes
        if (!nombre_pieza || !id_modelo || !id_marca || !id_categoria || !cantidad) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos", 
                required: ["nombre_pieza", "descripcion", "id_modelo", "id_marca", "id_categoria", "cantidad"],
                received: req.body 
            });
        }

        const result = await pool.query(
            "INSERT INTO pieza (nombre_pieza, descripcion, id_modelo, id_marca, id_categoria, cantidad, precio, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre_pieza, descripcion, id_modelo, id_marca, id_categoria, cantidad, precio, imagen || 0]
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
        const { nombre_pieza, descripcion, id_modelo, id_marca, id_categoria, cantidad, precio, imagen } = req.body;

        const result = await pool.query(
            "UPDATE pieza SET nombre_pieza = $1, descripcion = $2, id_modelo = $3, id_marca = $4, id_categoria = $5, cantidad = $6, precio = $7, imagen = $8 WHERE id_pieza = $9 RETURNING *",
            [nombre_pieza, descripcion, id_modelo, id_marca, id_categoria, cantidad, precio || 0, imagen, id]
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
        const result = await pool.query(`
            SELECT pieza.*,
            marcas.nombre_marca AS marca_nombre,
            modelos.nombre_modelo AS modelo_nombre,
            categoria.nombre_categoria AS categoria_nombre
            FROM pieza 
            INNER JOIN marcas ON pieza.id_marca = marcas.id_marca
            INNER JOIN categoria ON pieza.id_categoria = categoria.id_categoria
            INNER JOIN modelos ON pieza.id_modelo = modelos.id_modelo
            WHERE pieza.id_marca = $1`, 
            [id_marca]
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

// Función para filtrar piezas por nombre, marca, modelo y/o categoría
export const filtrarPiezas = async (req, res) => {
    try {
        const { nombre, marca, modelo, categoria } = req.query;

        let query = `
            SELECT pieza.*,
            marcas.nombre_marca AS marca_nombre,
            modelos.nombre_modelo AS modelo_nombre,
            categoria.nombre_categoria AS categoria_nombre
            FROM pieza 
            INNER JOIN marcas ON pieza.id_marca = marcas.id_marca
            INNER JOIN categoria ON pieza.id_categoria = categoria.id_categoria
            INNER JOIN modelos ON pieza.id_modelo = modelos.id_modelo
            WHERE 1=1`;
        
        const params = [];
        let paramIndex = 1;

        if (nombre) {
            query += ` AND LOWER(pieza.nombre_pieza) LIKE LOWER($${paramIndex})`;
            params.push(`%${nombre}%`);
            paramIndex++;
        }
        if (marca) {
            query += ` AND pieza.id_marca = $${paramIndex}`;
            params.push(parseInt(marca, 10));
            paramIndex++;
        }
        if (modelo) {
            query += ` AND pieza.id_modelo = $${paramIndex}`;
            params.push(parseInt(modelo, 10));
            paramIndex++;
        }
        if (categoria) {
            query += ` AND pieza.id_categoria = $${paramIndex}`;
            params.push(parseInt(categoria, 10));
            paramIndex++;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al filtrar piezas:", error);
        res.status(500).json({ message: "Error al filtrar piezas: " + error.message });
    }
};