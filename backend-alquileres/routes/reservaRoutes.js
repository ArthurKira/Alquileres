const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const verificarToken = require('../middlewares/authMiddleware');

// Crear una reserva
router.post('/', verificarToken, reservaController.crearReserva);

// Obtener reservas de un usuario
router.get('/usuario/:personaId', verificarToken, reservaController.obtenerReservasPorUsuario);

// Obtener una reserva por ID
router.get('/:id', verificarToken, reservaController.obtenerReservaPorId);

// Actualizar una reserva
router.put('/:id', verificarToken, reservaController.actualizarReserva);

// Eliminar una reserva
router.delete('/:id', verificarToken, reservaController.eliminarReserva);

module.exports = router;