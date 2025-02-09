const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un reporte
router.post('/', verificarToken, verificarRol(['administrador']), reporteController.crearReporte);

// Obtener todos los reportes
router.get('/', verificarToken, reporteController.obtenerReportes);

// Obtener un reporte por ID
router.get('/:id', verificarToken, reporteController.obtenerReportePorId);

// Actualizar un reporte
router.put('/:id', verificarToken, verificarRol(['administrador']), reporteController.actualizarReporte);

// Eliminar un reporte
router.delete('/:id', verificarToken, verificarRol(['administrador']), reporteController.eliminarReporte);

module.exports = router;