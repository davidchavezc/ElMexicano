import { Router } from 'express';
import {
    getModelos,
    getModeloPorId,
    updateModelo,
    deleteModelo,
    getModelosPorMarca,
    crearModelo,
    getModelosPorMarcaYAnio
} from "../controllers/modelo.controllers.js";

import { eliminarModeloPorCampos } from "../controllers/modelo.controllers.js";

const router = Router();

// Rutas para modelos
router.get("/modelos", getModelos);
router.delete("/modelos/eliminar", eliminarModeloPorCampos);
router.get("/modelos/:id", getModeloPorId);
router.post("/modelos", crearModelo);
router.put("/modelos/:id", updateModelo);
router.delete("/modelos/:id", deleteModelo);
router.get("/modelos/marca/:id_marca", getModelosPorMarca);
router.get("/modelos/marca/:id_marca/anio/:anio_modelo", getModelosPorMarcaYAnio);

export default router;