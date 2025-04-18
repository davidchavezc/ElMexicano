import {pool} from '../db.js'

export const postLogin = async (req,res) => {
    const { nombre_usuario, contraseña_usuario } = req.body;
    try{
        await pool.query("SELECT * FROM usuario WHERE nombre_usuario=$1 AND contraseña_usuario=$2", [nombre_usuario, contraseña_usuario]);
        res.status(200).json({ message: 'Actualización exitosa' }); 

        if (resultado.rows.length === 0) {
            // Credenciales incorrectas
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
          }
      
          const usuario = resultado.rows[0];
      
          // Guardar en sesión
          req.session.usuario = {
            id: usuario.id_usuario,
            nombre: usuario.nombre_usuario,
            rol: usuario.id_rol
          };

          const redirigirA = usuario.rol_id === 1 ? "/admin" : "/pos";

        return res.status(200).json({ mensaje: "Login exitoso", redirigirA });


    }
    catch{
        console.error("Error al intentar entrar", error);
        res.status(500).send("Error interno del servidor");
    }

}