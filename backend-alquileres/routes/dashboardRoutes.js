const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Obtener estadísticas de espacios alquilados
router.get('/estadisticas/espacios', 
    verificarToken, 
    verificarRol(['administrador', 'propietario']), 
    dashboardController.obtenerEstadisticasEspacios
);

// Obtener cantidad de inquilinos
router.get('/estadisticas/inquilinos', 
    verificarToken, 
    verificarRol(['administrador', 'propietario']), 
    dashboardController.obtenerCantidadInquilinos
);

// Obtener resumen de pagos y gastos
router.get('/estadisticas/financiero', 
    verificarToken, 
    verificarRol(['administrador', 'propietario']), 
    dashboardController.obtenerResumenFinanciero
);

// Obtener inquilinos con pagos atrasados
router.get('/estadisticas/pagos-atrasados', 
    verificarToken, 
    verificarRol(['administrador', 'propietario']), 
    dashboardController.obtenerInquilinosPagosAtrasados
);

// Obtener estadísticas mensuales de pagos
router.get('/estadisticas/mensuales', 
    verificarToken, 
    verificarRol(['administrador', 'propietario']), 
    dashboardController.obtenerEstadisticasMensuales
);

module.exports = router; 