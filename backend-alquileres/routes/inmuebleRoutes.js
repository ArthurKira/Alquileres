const express = require('express');
const router = express.Router();
const inmuebleController = require('../controllers/inmuebleController');
const verificarToken = require('../middlewares/authMiddleware');
// const verificarRol = require('../middlewares/rolMiddleware'); // Crear este middleware

// Obtener todos los inmuebles (público)
router.get('/', inmuebleController.obtenerInmuebles);

// Obtener inmuebles por propietario (público)
router.get('/propietario/:propietarioId', inmuebleController.obtenerInmueblesPorPropietario);

// Obtener un inmueble por ID (público)
router.get('/:id', inmuebleController.obtenerInmueblePorId);

// Rutas protegidas (solo administradores o propietarios)
router.post('/', verificarToken, inmuebleController.crearInmueble);
router.put('/:id', verificarToken, inmuebleController.actualizarInmueble);
router.delete('/:id', verificarToken, inmuebleController.eliminarInmueble);

module.exports = router;