import { pool } from '../db.js';

// Obtener usuarios
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *, rol.nombre_tipo AS nombre_rol
      FROM usuario INNER JOIN rol
      ON usuario.id_rol = rol.id_rol;`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Agregar usuario
export const agregarUsuario = async (req, res) => {
  try {
    const { nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol } = req.body;

    if (!nombre_empleado || !apellido_empleado || !usuario_empleado || !contrasena_empleado || !id_rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      "INSERT INTO usuario (nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Editar usuario
export const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params; // Usando id_empleado ahora
    const { nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol } = req.body;

    if (!nombre_empleado || !apellido_empleado || !usuario_empleado || !contrasena_empleado || !id_rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      "UPDATE usuario SET nombre_empleado = $1, apellido_empleado = $2, usuario_empleado = $3, contrasena_empleado = $4, id_rol = $5 WHERE id_empleado = $6 RETURNING *",
      [nombre_empleado, apellido_empleado, usuario_empleado, contrasena_empleado, id_rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params; // Usando id_empleado ahora

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido o no definido" });
    }

    const result = await pool.query(
      "DELETE FROM usuario WHERE id_empleado = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};
