import express from 'express';
import { obtenerHistorial, filtrarPorFecha } from '../controllers/historial.controllers.js';

const router = express.Router();

router.get('/api/historial', filtrarPorFecha); // mismo endpoint para ambos

export default router;
