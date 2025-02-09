const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un gasto
router.post('/', verificarToken, verificarRol(['administrador', 'propietario']), gastoController.crearGasto);

// Obtener todos los gastos de un inmueble
router.get('/inmuebles/:inmuebleId', verificarToken, gastoController.obtenerGastosPorInmueble);

// Obtener un gasto por ID
router.get('/:id', verificarToken, gastoController.obtenerGastoPorId);

// Actualizar un gasto
router.put('/:id', verificarToken, verificarRol(['administrador', 'propietario']), gastoController.actualizarGasto);

// Eliminar un gasto
router.delete('/:id', verificarToken, verificarRol(['administrador', 'propietario']), gastoController.eliminarGasto);

module.exports = router;