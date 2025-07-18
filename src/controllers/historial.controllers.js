import { pool } from '../db.js';

// Obtener todas las ventas con detalles
export const obtenerHistorial = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id_venta, v.nombre_cliente, v.fecha_hora, v.id_empleado, v.id_metodopago,
             CONCAT(u.nombre_empleado, ' ', u.apellido_empleado) AS empleado,
             m.nombre_metodopago AS metodo_pago,
             (
               SELECT SUM(subtotal)
               FROM detalle_venta
               WHERE id_venta = v.id_venta
             ) AS monto_total
      FROM venta v
      JOIN usuario u ON v.id_empleado = u.id_empleado
      JOIN metodo_pago m ON v.id_metodopago = m.id_metodopago
      ORDER BY v.fecha_hora DESC
    `);

    // Obtener detalles de cada venta
    const ventasConDetalles = await Promise.all(result.rows.map(async venta => {
      const detalles = await pool.query(`
        SELECT dv.id_pieza, p.nombre_pieza, dv.cantidad, dv.subtotal
        FROM detalle_venta dv
        JOIN pieza p ON dv.id_pieza = p.id_pieza
        WHERE dv.id_venta = $1
      `, [venta.id_venta]);

      return {
        ...venta,
        detalles: detalles.rows
      };
    }));

    res.json(ventasConDetalles);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: 'Error al obtener el historial de ventas' });
  }
};

// Filtrar por fecha
export const filtrarPorFecha = async (req, res) => {
  const { año, mes, dia } = req.query;

  try {
    let query = `
      SELECT v.id_venta, v.nombre_cliente, v.fecha_hora, v.id_empleado, v.id_metodopago,
             CONCAT(u.nombre_empleado, ' ', u.apellido_empleado) AS empleado,
             m.nombre_metodopago AS metodo_pago,
             (
               SELECT SUM(subtotal)
               FROM detalle_venta
               WHERE id_venta = v.id_venta
             ) AS monto_total
      FROM venta v
      JOIN usuario u ON v.id_empleado = u.id_empleado
      JOIN metodo_pago m ON v.id_metodopago = m.id_metodopago
      WHERE 1 = 1
    `;

    const params = [];
    let paramIndex = 1;

    if (año) {
      query += ` AND EXTRACT(YEAR FROM fecha_hora) = $${paramIndex++}`;
      params.push(año);
    }
    if (mes) {
      query += ` AND EXTRACT(MONTH FROM fecha_hora) = $${paramIndex++}`;
      params.push(mes);
    }
    if (dia) {
      query += ` AND EXTRACT(DAY FROM fecha_hora) = $${paramIndex++}`;
      params.push(dia);
    }

    query += ' ORDER BY v.fecha_hora DESC';

    const result = await pool.query(query, params);

    const ventasConDetalles = await Promise.all(result.rows.map(async venta => {
      const detalles = await pool.query(`
        SELECT dv.id_pieza, p.nombre_pieza, dv.cantidad, dv.subtotal
        FROM detalle_venta dv
        JOIN pieza p ON dv.id_pieza = p.id_pieza
        WHERE dv.id_venta = $1
      `, [venta.id_venta]);

      return {
        ...venta,
        detalles: detalles.rows
      };
    }));

    res.json(ventasConDetalles);
  } catch (error) {
    console.error("Error al filtrar por fecha:", error);
    res.status(500).json({ error: 'Error al filtrar por fecha' });
  }
};
