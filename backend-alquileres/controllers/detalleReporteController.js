const DetalleReporte = require('../models/detalleReporteModel');

// Crear un detalle de reporte
const crearDetalleReporte = async (req, res) => {
    try {
        const nuevoDetalleReporte = req.body;
        const idDetalleReporte = await DetalleReporte.crear(nuevoDetalleReporte);
        res.status(201).json({ mensaje: 'Detalle de reporte creado', id: idDetalleReporte });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el detalle de reporte', error: error.message });
    }
};

// Obtener todos los detalles de un reporte
const obtenerDetallesPorReporte = async (req, res) => {
    try {
        const { reporteId } = req.params;
        const detalles = await DetalleReporte.obtenerPorReporte(reporteId);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los detalles del reporte', error: error.message });
    }
};

// Obtener un detalle de reporte por ID
const obtenerDetalleReportePorId = async (req, res) => {
    try {
        const detalle = await DetalleReporte.obtenerPorId(req.params.id);
        if (!detalle) {
            return res.status(404).json({ mensaje: 'Detalle de reporte no encontrado' });
        }
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el detalle de reporte', error: error.message });
    }
};

// Actualizar un detalle de reporte
const actualizarDetalleReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await DetalleReporte.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Detalle de reporte no encontrado' });
        }
        res.json({ mensaje: 'Detalle de reporte actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el detalle de reporte', error: error.message });
    }
};

// Eliminar un detalle de reporte
const eliminarDetalleReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await DetalleReporte.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Detalle de reporte no encontrado' });
        }
        res.json({ mensaje: 'Detalle de reporte eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el detalle de reporte', error: error.message });
    }
};

module.exports = {
    crearDetalleReporte,
    obtenerDetallesPorReporte,
    obtenerDetalleReportePorId,
    actualizarDetalleReporte,
    eliminarDetalleReporte,
};