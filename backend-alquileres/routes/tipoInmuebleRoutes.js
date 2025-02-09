const express = require('express');
const router = express.Router();
const tipoInmuebleController = require('../controllers/tipoInmuebleController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un tipo de inmueble
router.post('/', verificarToken, verificarRol(['administrador']), tipoInmuebleController.crearTipoInmueble);

// Obtener todos los tipos de inmuebles
router.get('/', tipoInmuebleController.obtenerTiposInmueble);

// Obtener un tipo de inmueble por ID
router.get('/:id', tipoInmuebleController.obtenerTipoInmueblePorId);

// Actualizar un tipo de inmueble
router.put('/:id', verificarToken, verificarRol(['administrador']), tipoInmuebleController.actualizarTipoInmueble);

// Eliminar un tipo de inmueble
router.delete('/:id', verificarToken, verificarRol(['administrador']), tipoInmuebleController.eliminarTipoInmueble);

module.exports = router;