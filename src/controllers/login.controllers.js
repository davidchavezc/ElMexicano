import { pool } from '../db.js';

export const postLogin = async (req, res) => {
    const { usuario_empleado, contrasena_empleado } = req.body;
    console.log("Datos recibidos:", { usuario_empleado, contrasena_empleado });
  
    if (!usuario_empleado || !contrasena_empleado) {
      return res.status(400).json({ mensaje: "Faltan credenciales" });
    }
  
    try {
      const resultado = await pool.query(
        "SELECT * FROM usuario WHERE usuario_empleado=$1 AND contrasena_empleado=$2",
        [usuario_empleado, contrasena_empleado]
      );
  
      if (resultado.rows.length === 0) {
        return res.status(401).json({ mensaje: "Usuario o contrasena incorrectos" });
      }
  
      const usuario = resultado.rows[0];
  
      req.session.usuario = {
        id: usuario.id_usuario,
        nombre: usuario.nombre_empleado,
        rol: usuario.id_rol
      };
  
      return res.status(200).json({mensaje: "Login exitoso", id_rol: usuario.id_rol });
    } catch (error) {
      console.error("Error al intentar entrar", error);
      res.status(500).send("Error interno del servidor");
    }
  };