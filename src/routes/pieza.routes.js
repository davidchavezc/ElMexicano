import { Router } from "express";
import{
    getObtenerPieza,
    getObtenerPiezaPorId,
    postCrearPieza,
    actualizarPieza,
    eliminarPieza,
    actualizarCantidadPieza,
    obtenerPiezasPorMarca,
    getPiezasPorModelo,
    getPiezasPorCategoria,
    getCategorias,
    filtrarPiezas
} from '../controllers/pieza.controllers.js';

const routerDePiezas = Router();

// Rutas para piezas
routerDePiezas.get('/piezas', getObtenerPieza);
routerDePiezas.get('/piezas/:id', getObtenerPiezaPorId);
routerDePiezas.post('/piezas', postCrearPieza);
routerDePiezas.put('/piezas/:id', actualizarPieza);
routerDePiezas.delete('/piezas/:id', eliminarPieza);

// Rutas para restock
routerDePiezas.put('/piezas/restock/:id', actualizarCantidadPieza);

// Ruta para filtrado combinado
routerDePiezas.get('/piezas/filtrar', filtrarPiezas);

// Rutas para filtrado individual
routerDePiezas.get('/piezas/marca/:id_marca', obtenerPiezasPorMarca);
routerDePiezas.get('/piezas/modelo/:id_modelo', getPiezasPorModelo);
routerDePiezas.get('/piezas/categoria/:id_categoria', getPiezasPorCategoria);

// Rutas para categorias
routerDePiezas.get('/categorias', getCategorias);

export default routerDePiezas;