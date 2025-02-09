const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un pago
router.post('/', verificarToken, verificarRol(['inquilino', 'administrador']), pagoController.crearPago);

// Obtener todos los pagos de un contrato
router.get('/contratos/:contratoId/pagos', verificarToken, pagoController.obtenerPagosPorContrato);

// Obtener un pago por ID
router.get('/:id', verificarToken, pagoController.obtenerPagoPorId);

// Actualizar un pago
router.put('/:id', verificarToken, verificarRol(['administrador']), pagoController.actualizarPago);

// Eliminar un pago
router.delete('/:id', verificarToken, verificarRol(['administrador']), pagoController.eliminarPago);

module.exports = router;