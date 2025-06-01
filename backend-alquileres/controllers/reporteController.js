const Reporte = require('../models/reporteModel');

// Crear un reporte
const crearReporte = async (req, res) => {
    try {
        const nuevoReporte = req.body;
        const idReporte = await Reporte.crear(nuevoReporte);
        res.status(201).json({ mensaje: 'Reporte creado', id: idReporte });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el reporte', error: error.message });
    }
};

// Obtener todos los reportes
const obtenerReportes = async (req, res) => {
    try {
        const reportes = await Reporte.obtenerTodos();
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los reportes', error: error.message });
    }
};

// Obtener un reporte por ID
const obtenerReportePorId = async (req, res) => {
    try {
        const reporte = await Reporte.obtenerPorId(req.params.id);
        if (!reporte) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el reporte', error: error.message });
    }
};

// Actualizar un reporte
const actualizarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Reporte.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }
        res.json({ mensaje: 'Reporte actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el reporte', error: error.message });
    }
};

// Eliminar un reporte
const eliminarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Reporte.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }
        res.json({ mensaje: 'Reporte eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el reporte', error: error.message });
    }
};

// Generar reporte de pagos
const generarReportePagos = async (req, res) => {
    try {
        const filtros = req.query;
        const pagos = await Reporte.reportePagos(filtros);
        
        // Calcular estadísticas si se solicitan
        if (req.query.incluir_estadisticas === 'true') {
            let totalMonto = 0;
            let pagosCompletados = 0;
            let pagosPendientes = 0;
            
            pagos.forEach(pago => {
                // Convertir el monto a número y sumarlo
                const monto = parseFloat(pago.monto);
                if (!isNaN(monto)) {
                    totalMonto += monto;
                }
                
                // Contar pagos por estado
                if (pago.estado === 'pagado') {
                    pagosCompletados++;
                } else if (pago.estado === 'pendiente') {
                    pagosPendientes++;
                }
            });
            
            return res.json({
                datos: pagos,
                estadisticas: {
                    total_registros: pagos.length,
                    total_monto: totalMonto,
                    pagos_completados: pagosCompletados,
                    pagos_pendientes: pagosPendientes
                }
            });
        }
        
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar el reporte de pagos', error: error.message });
    }
};

// Generar reporte de gastos
const generarReporteGastos = async (req, res) => {
    try {
        const filtros = req.query;
        const gastos = await Reporte.reporteGastos(filtros);
        
        // Calcular estadísticas si se solicitan
        if (req.query.incluir_estadisticas === 'true') {
            let totalMonto = 0;
            const gastosPorTipo = {};
            
            gastos.forEach(gasto => {
                const monto = parseFloat(gasto.monto);
                totalMonto += monto;
                
                // Agrupar por tipo de gasto
                if (!gastosPorTipo[gasto.tipo_gasto]) {
                    gastosPorTipo[gasto.tipo_gasto] = {
                        cantidad: 0,
                        monto_total: 0
                    };
                }
                
                gastosPorTipo[gasto.tipo_gasto].cantidad++;
                gastosPorTipo[gasto.tipo_gasto].monto_total += monto;
            });
            
            // Formatear los montos totales
            Object.keys(gastosPorTipo).forEach(tipo => {
                gastosPorTipo[tipo].monto_total = gastosPorTipo[tipo].monto_total.toFixed(2);
            });
            
            return res.json({
                datos: gastos,
                estadisticas: {
                    total_registros: gastos.length,
                    total_monto: totalMonto.toFixed(2),
                    gastos_por_tipo: gastosPorTipo
                }
            });
        }
        
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar el reporte de gastos', error: error.message });
    }
};

// NUEVOS CONTROLADORES PARA EL DASHBOARD

// Total de inquilinos por mes
const totalInquilinosPorMes = async (req, res) => {
    try {
        const resultado = await Reporte.totalInquilinosPorMes();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener total de inquilinos por mes', error: error.message });
    }
};

// Espacios disponibles vs ocupados
const espaciosDisponiblesVsOcupados = async (req, res) => {
    try {
        const resultado = await Reporte.espaciosDisponiblesVsOcupados();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener espacios disponibles vs ocupados', error: error.message });
    }
};

// Ingresos mensuales
const ingresosMensuales = async (req, res) => {
    try {
        const resultado = await Reporte.ingresosMensuales();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener ingresos mensuales', error: error.message });
    }
};

// Gastos mensuales
const gastosMensuales = async (req, res) => {
    try {
        const resultado = await Reporte.gastosMensuales();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener gastos mensuales', error: error.message });
    }
};

// Contratos activos vs mes anterior
const contratosActivos = async (req, res) => {
    try {
        const resultado = await Reporte.contratosActivos();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener contratos activos', error: error.message });
    }
};

// Tasa de ocupación por inmueble
const tasaOcupacion = async (req, res) => {
    try {
        const resultado = await Reporte.tasaOcupacion();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tasa de ocupación', error: error.message });
    }
};

// Contratos por vencer
const contratosPorVencer = async (req, res) => {
    try {
        const resultado = await Reporte.contratosPorVencer();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener contratos por vencer', error: error.message });
    }
};

// Pagos pendientes vs pagados por mes
const pagosPendientesVsPagados = async (req, res) => {
    try {
        const resultado = await Reporte.pagosPendientesVsPagados();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pagos pendientes vs pagados', error: error.message });
    }
};

// Contratos vencidos vs renovados por mes
const contratosVencidosVsRenovados = async (req, res) => {
    try {
        const resultado = await Reporte.contratosVencidosVsRenovados();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener contratos vencidos vs renovados', error: error.message });
    }
};

// Obtener todos los datos del dashboard en una sola llamada
const obtenerDatosDashboard = async (req, res) => {
    try {
        const [
            totalInquilinos,
            espaciosDisponibles,
            ingresos,
            gastos,
            contratos,
            ocupacion,
            contratosPorVencer,
            pagos,
            contratosVencidos
        ] = await Promise.all([
            Reporte.totalInquilinosPorMes(),
            Reporte.espaciosDisponiblesVsOcupados(),
            Reporte.ingresosMensuales(),
            Reporte.gastosMensuales(),
            Reporte.contratosActivos(),
            Reporte.tasaOcupacion(),
            Reporte.contratosPorVencer(),
            Reporte.pagosPendientesVsPagados(),
            Reporte.contratosVencidosVsRenovados()
        ]);
        
        res.json({
            totalInquilinos,
            espaciosDisponibles,
            ingresos,
            gastos,
            contratos,
            ocupacion,
            contratosPorVencer,
            pagos,
            contratosVencidos
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos del dashboard', error: error.message });
    }
};

module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportePorId,
    actualizarReporte,
    eliminarReporte,
    generarReportePagos,
    generarReporteGastos,
    // Nuevos endpoints para dashboard
    totalInquilinosPorMes,
    espaciosDisponiblesVsOcupados,
    ingresosMensuales,
    gastosMensuales,
    contratosActivos,
    tasaOcupacion,
    contratosPorVencer,
    pagosPendientesVsPagados,
    contratosVencidosVsRenovados,
    obtenerDatosDashboard
};