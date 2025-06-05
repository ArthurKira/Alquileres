const express = require('express');
const router = express.Router();
const detalleReporteController = require('../controllers/detalleReporteController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un detalle de reporte
router.post('/', verificarToken, verificarRol(['administrador']), detalleReporteController.crearDetalleReporte);

// Obtener todos los detalles de un reporte
router.get('/reportes/:reporteId', verificarToken, detalleReporteController.obtenerDetallesPorReporte);

// Obtener un detalle de reporte por ID
router.get('/:id', verificarToken, detalleReporteController.obtenerDetalleReportePorId);

// Actualizar un detalle de reporte
router.put('/:id', verificarToken, verificarRol(['administrador']), detalleReporteController.actualizarDetalleReporte);

// Eliminar un detalle de reporte
router.delete('/:id', verificarToken, verificarRol(['administrador']), detalleReporteController.eliminarDetalleReporte);

module.exports = router;