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
    getCategorias
} from '../controllers/pieza.controllers.js';