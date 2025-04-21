import { Router } from 'express';
import {
    getModelos,
    getModeloPorId,
    updateModelo,
    deleteModelo,
    getModelosPorMarca,
    crearModelo
} from "../controllers/modelo.controllers.js";

const router = Router();

// Rutas para modelos
router.get("/modelos", getModelos);
router.get("/modelos/:id", getModeloPorId);
router.post("/modelos", crearModelo);
router.put("/modelos/:id", updateModelo);
router.delete("/modelos/:id", deleteModelo);
router.get("/modelos/marca/:id_marca", getModelosPorMarca);

export default router;