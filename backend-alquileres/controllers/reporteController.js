const Reporte = require('../models/Reporte');

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

module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportePorId,
    actualizarReporte,
    eliminarReporte,
};