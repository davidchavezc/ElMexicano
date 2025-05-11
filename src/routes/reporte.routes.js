// routes/reporte.routes.js
import express from 'express';
import { obtenerDatosGrafica } from '../controllers/reporte.controllers.js';

const router = express.Router();

router.get('/api/reporte/grafica', obtenerDatosGrafica);

export default router;
