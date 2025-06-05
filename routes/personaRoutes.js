const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware'); // Crear este middleware

// Obtener todas las personas (público)
router.get('/', personaController.obtenerPersonas);

// Obtener todas las personas (público)
router.get('/inquilinosObtener', personaController.obtenerInquilinos);
// Obtener una persona por ID (público)
router.get('/:id', personaController.obtenerPersonaPorId);

// Obtener una persona por email (público)
router.get('/email/:email', personaController.obtenerPersonaPorEmail);

// Obtener una persona por documento (público)
router.get('/dni/:dni', personaController.obtenerPersonaPorDocumento);

// Rutas protegidas (solo administradores o roles específicos)
router.post('/', verificarToken, verificarRol(['administrador']), personaController.crearPersona);
router.put('/:id', verificarToken, verificarRol(['administrador']), personaController.actualizarPersona);
router.delete('/:id', verificarToken, verificarRol(['administrador']), personaController.eliminarPersona);

module.exports = router;
