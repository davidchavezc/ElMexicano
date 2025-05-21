import { Router } from "express";
import{
    getObtenerPiezaPorId,
    postCrearPieza,
    actualizarPieza,
    eliminarPieza,
    actualizarCantidadPieza,
    obtenerPiezasPorMarca,
    getPiezasPorModelo,
    getPiezasPorCategoria,
    getCategorias,
    filtrarPiezas,
    getPiezas
} from '../controllers/pieza.controllers.js';

const routerDePiezas = Router();

// Rutas para piezas
routerDePiezas.get('/piezas', getPiezas);
routerDePiezas.get('/piezas/filtrar', filtrarPiezas);
routerDePiezas.get('/piezas/:id', getObtenerPiezaPorId);
routerDePiezas.post('/piezas', postCrearPieza);
routerDePiezas.put('/piezas/:id', actualizarPieza);
routerDePiezas.delete('/piezas/:id', eliminarPieza);

// Rutas para restock
routerDePiezas.put('/piezas/restock/:id', actualizarCantidadPieza);

// Rutas para filtrado individual
routerDePiezas.get('/piezas/marca/:id_marca', obtenerPiezasPorMarca);
routerDePiezas.get('/piezas/modelo/:id_modelo', getPiezasPorModelo);
routerDePiezas.get('/piezas/categoria/:id_categoria', getPiezasPorCategoria);

// Rutas para categorias
routerDePiezas.get('/categorias', getCategorias);

export default routerDePiezas;