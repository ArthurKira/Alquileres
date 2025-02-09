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
router.get('/propietarios/:propietarioId', verificarToken, contratoController.obtenerContratosPorPropietario);

// Obtener un contrato por ID
router.get('/:id', verificarToken, contratoController.obtenerContratoPorId);

// Actualizar un contrato
router.put('/:id', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.actualizarContrato);

// Eliminar un contrato
router.delete('/:id', verificarToken, verificarRol(['administrador', 'propietario']), contratoController.eliminarContrato);

module.exports = router;