const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un contrato
router.post('/', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.crearContrato);

// Obtener todos los contratos de un inquilino
router.get('/inquilinos/:inquilinoId', verificarToken, contratoController.obtenerContratosPorInquilino);

// Obtener todos los contratos de un propietario
router.get('/inmuebles/:inmuebleId', verificarToken, contratoController.obtenerContratosPorInmueble);

// Obtener un contrato por ID
router.get('/:id', verificarToken, contratoController.obtenerContratoPorId);

// Actualizar un contrato
router.put('/:id', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.actualizarContrato);

// Eliminar un contrato
router.delete('/:id', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.eliminarContrato);

// Obtener todos los contratos con información completa
router.get('/info', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.obtenerContratosConInfo);

module.exports = router;