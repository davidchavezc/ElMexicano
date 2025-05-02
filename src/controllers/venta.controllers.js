import { pool } from '../db.js';

export const getPiezas = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM pieza");
        res.json(result.rows);
    }
    catch{
        console.error("Error al obtener pieza:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const getPiezaById = async (req, res) => {
    const { id } = req.params;
    try {
        // Consulta para obtener la pieza por ID
        const result = await pool.query("SELECT * FROM pieza WHERE id_pieza = $1", [id]);

        // Verificar si no se encontró la pieza
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pieza no encontrada." });
        }

        // Devolver solo la primera fila encontrada
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener pieza:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const postVenta = async (req, res) => {
    try {
        const { id_empleado, nombre_cliente, id_metodopago, piezas } = req.body;
    
        if (!id_empleado || !nombre_cliente || !id_metodopago || !Array.isArray(piezas) || piezas.length === 0) {
          return res.status(400).json({ message: "Datos incompletos" });
        }
    
        let montoTotal = 0;
    
        // Validar y calcular subtotal de cada pieza
        for (const item of piezas) {
          const pieza = await pieza.findByPk(item.id_pieza);
          if (!pieza) {
            return res.status(404).json({ message: `La pieza con ID ${item.id_pieza} no existe` });
          }
          if (pieza.stock < item.cantidad) {
            return res.status(400).json({ message: `Stock insuficiente para la pieza ${pieza.nombre}` });
          }
          item.subtotal = pieza.precio * item.cantidad; // Asumimos que pieza.precio existe
          montoTotal += item.subtotal;
        }
    
        // Crear la venta
        const nuevaVenta = await Venta.create({
          id_empleado,
          nombre_cliente,
          id_metodopago,
          fecha_hora: new Date(),
          monto: montoTotal,
        });
    
        // Crear detalle_venta y actualizar stock
        for (const item of piezas) {
          await DetalleVenta.create({
            id_venta: nuevaVenta.id_venta,
            id_pieza: item.id_pieza,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          });
    
          const pieza = await pieza.findByPk(item.id_pieza);
          pieza.stock -= item.cantidad;
          await pieza.save();
        }
    
        res.status(201).json({ message: "Venta registrada exitosamente", id_venta: nuevaVenta.id_venta });
        
    } catch (error) {
        console.error("Error al registrar venta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getMetodoPago = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM metodo_pago");
    console.log("Métodos de pago obtenidos:", result.rows);
  } catch (error) {
      console.error("Error al obtener métodos de pago:", error);
      res.status(500).json({ message: "Error al obtener métodos de pago", error: error.message });
  }
};