import { Router } from 'express';
import {
  getPiezas,
  getPiezaById,
  postVenta,
  getMetodoPago,
} from '../controllers/venta.controllers.js';

const router = Router();

router.get('/ventas/metodoPago', getMetodoPago);
router.get('/ventas/:id', getPiezaById);
router.get('/ventas', getPiezas);
router.post('/ventas/registrar', postVenta);


export default router;