import { pool } from '../db.js';

// Obtener todas las ventas
export const obtenerHistorial = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, u.usuario AS empleado, m.nombre_metodo AS metodo_pago
      FROM venta v
      JOIN usuario u ON v.id_empleado = u.id_empleado
      JOIN metodo_pago m ON v.id_metodopago = m.id_metodopago
      ORDER BY v.fecha_hora DESC
    `);
    res.json(result.rows);
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
      SELECT v.*, u.usuario AS empleado, m.nombre_metodo AS metodo_pago
      FROM venta v
      JOIN usuario u ON v.id_empleado = u.id_empleado
      JOIN metodo_pago m ON v.id_metodopago = m.id_metodopago
      WHERE EXTRACT(YEAR FROM fecha_hora) = $1
    `;
    const params = [año];

    if (mes) {
      query += ' AND EXTRACT(MONTH FROM fecha_hora) = $2';
      params.push(mes);
    }

    if (dia) {
      query += ' AND EXTRACT(DAY FROM fecha_hora) = $3';
      params.push(dia);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al filtrar por fecha:", error);
    res.status(500).json({ error: 'Error al filtrar por fecha' });
  }
};
