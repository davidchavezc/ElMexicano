import {pool} from '../db.js'

export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuario");
        res.json(result.rows); 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const agregarUsuario = async (req, res) => {
  try {
    const {
      nombre_empleado,
      apellido_empleado,
      usuario_empleado,
      contrasena_empleado,
      id_rol,
    } = req.body;

    if (
      !nombre_empleado ||
      !apellido_empleado ||
      !usuario_empleado ||
      !contrasena_empleado ||
      !id_rol
    ) {
      return res.status(400).send("Todos los campos son obligatorios");
    }

    const result = await pool.query(
      "INSERT INTO usuario (nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        nombre_empleado,
        apellido_empleado,
        usuario_empleado,
        contrasena_empleado,
        id_rol,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};