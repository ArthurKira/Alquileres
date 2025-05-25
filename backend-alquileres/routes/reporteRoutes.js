const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Crear un reporte
router.post('/', verificarToken, verificarRol(['administrador']), reporteController.crearReporte);

// Obtener todos los reportes
router.get('/', verificarToken, reporteController.obtenerReportes);

// Generar reporte de pagos
router.get('/generar/pagos', verificarToken, reporteController.generarReportePagos);

// Generar reporte de gastos
router.get('/generar/gastos', verificarToken, reporteController.generarReporteGastos);

// Obtener un reporte por ID
router.get('/:id', verificarToken, reporteController.obtenerReportePorId);

// Actualizar un reporte
router.put('/:id', verificarToken, verificarRol(['administrador']), reporteController.actualizarReporte);

// Eliminar un reporte
router.delete('/:id', verificarToken, verificarRol(['administrador']), reporteController.eliminarReporte);

// NUEVAS RUTAS PARA EL DASHBOARD

// Obtener todos los datos del dashboard en una sola llamada
router.get('/dashboard/completo', verificarToken, reporteController.obtenerDatosDashboard);

// Total de inquilinos por mes
router.get('/dashboard/inquilinos', verificarToken, reporteController.totalInquilinosPorMes);

// Espacios disponibles vs ocupados
router.get('/dashboard/espacios', verificarToken, reporteController.espaciosDisponiblesVsOcupados);

// Ingresos mensuales
router.get('/dashboard/ingresos', verificarToken, reporteController.ingresosMensuales);

// Gastos mensuales
router.get('/dashboard/gastos', verificarToken, reporteController.gastosMensuales);

// Contratos activos vs mes anterior
router.get('/dashboard/contratos-activos', verificarToken, reporteController.contratosActivos);

// Tasa de ocupación por inmueble
router.get('/dashboard/ocupacion', verificarToken, reporteController.tasaOcupacion);

// Contratos por vencer
router.get('/dashboard/contratos-por-vencer', verificarToken, reporteController.contratosPorVencer);

// Pagos pendientes vs pagados por mes
router.get('/dashboard/pagos', verificarToken, reporteController.pagosPendientesVsPagados);

// Contratos vencidos vs renovados por mes
router.get('/dashboard/contratos-renovados', verificarToken, reporteController.contratosVencidosVsRenovados);

module.exports = router;