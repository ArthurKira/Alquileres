const express = require('express');
const router = express.Router();
const espacioController = require('../controllers/espacioController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Obtener todos los espacios con información completa
router.get('/', espacioController.obtenerEspacio);

// Obtener todos los espacios de un piso
router.get('/inmuebles/:inmuebleId/pisos/:pisoId/espacios', espacioController.obtenerEspaciosPorPiso);

// Obtener un espacio específico
router.get('/inmuebles/:inmuebleId/pisos/:pisoId/espacios/:espacioId', espacioController.obtenerEspacioPorId);

// Crear un nuevo espacio en un piso
router.post(
    '/inmuebles/:inmuebleId/pisos/:pisoId/espacios',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.crearEspacio
);

// Actualizar un espacio
router.put(
    '/inmuebles/:inmuebleId/pisos/:pisoId/espacios/:espacioId',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.actualizarEspacio
);

// Cambiar estado del espacio
router.put('/estado/:id',
    verificarToken,
    verificarRol(['administrador']),
    espacioController.cambiarEstado
);

// Eliminar un espacio
router.delete(
    '/inmuebles/:inmuebleId/pisos/:pisoId/espacios/:espacioId',
    verificarToken,
    verificarRol(['administrador', 'propietario']),
    espacioController.eliminarEspacio
);

module.exports = router;