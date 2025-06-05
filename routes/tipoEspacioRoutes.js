const express = require('express');
const router = express.Router();
const tipoEspacioController = require('../controllers/tipoEspacioController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un tipo de espacio
router.post('/', verificarToken, verificarRol(['administrador']), tipoEspacioController.crearTipoEspacio);

// Obtener todos los tipos de espacios
router.get('/', tipoEspacioController.obtenerTiposEspacio);

// Obtener un tipo de espacio por ID
router.get('/:id', tipoEspacioController.obtenerTipoEspacioPorId);

// Actualizar un tipo de espacio
router.put('/:id', verificarToken, verificarRol(['administrador']), tipoEspacioController.actualizarTipoEspacio);

// Eliminar un tipo de espacio
router.delete('/:id', verificarToken, verificarRol(['administrador']), tipoEspacioController.eliminarTipoEspacio);

module.exports = router;