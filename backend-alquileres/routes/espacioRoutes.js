const express = require('express');
const router = express.Router();
const espacioController = require('../controllers/espacioController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Obtener espacios de un piso (público)
router.get('/pisos/:pisoId/espacios', espacioController.obtenerEspaciosPorPiso);

// Obtener un espacio por ID (público)
router.get('/:id', espacioController.obtenerEspacioPorId);

// Rutas protegidas (solo administradores o propietarios)
router.post(
    '/pisos/:pisoId/espacios',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.crearEspacio
);

router.put(
    '/:id',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.actualizarEspacio
);

router.delete(
    '/:id',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.eliminarEspacio
);

module.exports = router;