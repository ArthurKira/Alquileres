const express = require('express');
const router = express.Router();
const pisoController = require('../controllers/pisoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un piso
router.post('/', verificarToken, verificarRol(['administrador', 'propietario']), pisoController.crearPiso);

// Obtener todos los pisos de un inmueble
router.get('/inmuebles/:inmuebleId/pisos', pisoController.obtenerPisosPorInmueble);

// Obtener un piso por ID
router.get('/:id', pisoController.obtenerPisoPorId);

// Actualizar un piso
router.put('/:id', verificarToken, verificarRol(['administrador', 'propietario']), pisoController.actualizarPiso);

// Eliminar un piso
router.delete('/:id', verificarToken, verificarRol(['administrador', 'propietario']), pisoController.eliminarPiso);

module.exports = router;