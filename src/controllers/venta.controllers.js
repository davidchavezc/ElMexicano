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
  const client = await pool.connect(); // para manejar transacción

  try {
    const { id_empleado, nombre_cliente, id_metodopago, piezas } = req.body;

    console.log('Datos recibidos en req.body:', req.body);

    if (
      id_empleado == null ||
      nombre_cliente == null ||
      id_metodopago == null ||
      !Array.isArray(piezas) ||
      piezas.length === 0
    ) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    await client.query('BEGIN'); // iniciar transacción

    let montoTotal = 0;

    // Validar piezas, calcular subtotales y verificar stock
    for (const item of piezas) {
      const { rows } = await client.query("SELECT * FROM pieza WHERE id_pieza = $1", [item.id_pieza]);

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: `La pieza con ID ${item.id_pieza} no existe` });
      }

      const pieza = rows[0];

      if (pieza.cantidad < item.cantidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Stock insuficiente para la pieza ${pieza.nombre}` });
      }

      item.subtotal = pieza.precio * item.cantidad;
      montoTotal += item.subtotal;
    }

    // Insertar la venta
    const insertVenta = `
      INSERT INTO venta (id_empleado, nombre_cliente, id_metodopago, fecha_hora, monto)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING id_venta
    `;
    const ventaResult = await client.query(insertVenta, [id_empleado, nombre_cliente, id_metodopago, montoTotal]);
    const id_venta = ventaResult.rows[0].id_venta;

    // Insertar detalle_venta y actualizar stock
    for (const item of piezas) {
      await client.query(
        `INSERT INTO detalle_venta (id_venta, id_pieza, cantidad, subtotal)
         VALUES ($1, $2, $3, $4)`,
        [id_venta, item.id_pieza, item.cantidad, item.subtotal]
      );

      await client.query(
        `UPDATE pieza SET cantidad = cantidad - $1 WHERE id_pieza = $2`,
        [item.cantidad, item.id_pieza]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ message: "Venta registrada exitosamente", id_venta });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al registrar venta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  } finally {
    client.release(); // liberar conexión
  }
};

export const getMetodoPago = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM metodo_pago');
    res.json(result.rows);
  } catch (error) {
      console.error("Error al obtener métodos de pago:", error);
      res.status(500).json({ message: "Error al obtener métodos de pago", error: error.message });
  }
};
