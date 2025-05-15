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
                if (typeof gasto.monto === 'number') totalMonto += gasto.monto;
                
                // Agrupar por tipo de gasto
                if (!gastosPorTipo[gasto.tipo_gasto]) {
                    gastosPorTipo[gasto.tipo_gasto] = {
                        cantidad: 0,
                        monto_total: 0
                    };
                }
                
                gastosPorTipo[gasto.tipo_gasto].cantidad++;
                gastosPorTipo[gasto.tipo_gasto].monto_total += gasto.monto || 0;
            });
            
            return res.json({
                datos: gastos,
                estadisticas: {
                    total_registros: gastos.length,
                    total_monto: totalMonto,
                    gastos_por_tipo: gastosPorTipo
                }
            });
        }
        
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar el reporte de gastos', error: error.message });
    }
};

module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportePorId,
    actualizarReporte,
    eliminarReporte,
    generarReportePagos,
    generarReporteGastos
};