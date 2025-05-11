// controllers/reporte.controllers.js
import { pool } from '../db.js';

export const obtenerDatosGrafica = async (req, res) => {
  try {
    const { año, mes } = req.query;

    const condiciones = [];
    const valores = [];
    let i = 1;

    if (año) {
      condiciones.push(`EXTRACT(YEAR FROM fecha_hora) = $${i++}`);
      valores.push(año);
    }
    if (mes) {
      condiciones.push(`EXTRACT(MONTH FROM fecha_hora) = $${i++}`);
      valores.push(mes);
    }

    const whereClause = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('day', fecha_hora) AS fecha,
        SUM(
          (SELECT SUM(subtotal) FROM detalle_venta WHERE id_venta = v.id_venta)
        ) AS total
      FROM venta v
      ${whereClause}
      GROUP BY DATE_TRUNC('day', fecha_hora)
      ORDER BY fecha;
    `, valores);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos para la gráfica:', error);
    res.status(500).json({ error: 'Error al obtener los datos de la gráfica' });
  }
};
