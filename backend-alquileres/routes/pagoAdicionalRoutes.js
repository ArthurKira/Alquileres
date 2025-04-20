const express = require('express');
const router = express.Router();
const pagoAdicionalController = require('../controllers/pagoAdicionalController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un pago adicional
router.post('/', verificarToken, verificarRol(['administrador', 'propietario']), pagoAdicionalController.crearPagoAdicional);

// Obtener todos los pagos adicionales de un contrato
router.get('/contratos/:contratoId', verificarToken, pagoAdicionalController.obtenerPagosAdicionalesPorContrato);

// Obtener un pago adicional por ID
router.get('/:id', verificarToken, pagoAdicionalController.obtenerPagoAdicionalPorId);

// Actualizar un pago adicional
router.put('/:id', verificarToken, verificarRol(['administrador', 'propietario']), pagoAdicionalController.actualizarPagoAdicional);

// Eliminar un pago adicional
router.delete('/:id', verificarToken, verificarRol(['administrador', 'propietario']), pagoAdicionalController.eliminarPagoAdicional);

module.exports = router;