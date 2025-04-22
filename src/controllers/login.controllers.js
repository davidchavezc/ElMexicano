import { pool } from '../db.js';

export const postLogin = async (req, res) => {
    const { usuario_empleado, contrasena_empleado } = req.body;
    console.log("Datos recibidos:", { usuario_empleado, contrasena_empleado });
  
    if (!usuario_empleado || !contrasena_empleado) {
      return res.status(400).json({ mensaje: "Faltan credenciales" });
    }
  
    try {
      const resultado = await pool.query(
        "SELECT id_empleado, nombre_empleado, id_rol FROM usuario WHERE usuario_empleado=$1 AND contrasena_empleado=$2",
        [usuario_empleado, contrasena_empleado]
      );
  
      if (resultado.rows.length === 0) {
        return res.status(401).json({ mensaje: "Usuario o contrasena incorrectos" });
      }
  
      const usuario = resultado.rows[0];
  
      req.session.usuario = {
        id: usuario.id_empleado,
        nombre: usuario.nombre_empleado,
        rol: usuario.id_rol
      };
      
      console.log("Sesión creada:", req.session.usuario);

      res.setHeader('Content-Type', 'application/json');

      console.log("Enviando respuesta al cliente");
      return res.status(200).json({
        mensaje: "Login exitoso",
        id_rol: usuario.id_rol,
        redirect: usuario.id_rol === 1
            ? "/admin/empleados.html"
            : "/empleado/restock.html",
    });
    } catch (error) {
      console.error("Error al intentar entrar", error);
      res.status(500).send("Error interno del servidor");
    }
  };

  export const logOut = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
          console.error("Error al cerrar sesión:", err);
          return res.status(500).send("Error al cerrar sesión.");
      }
      res.redirect('/'); // Redirige a la página principal
  });
  };