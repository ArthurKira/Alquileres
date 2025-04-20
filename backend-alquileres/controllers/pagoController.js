const Pago = require('../models/pagoModel');

// Crear un pago
const crearPago = async (req, res) => {
    try {
        const nuevoPago = req.body;
        const idPago = await Pago.crear(nuevoPago);
        res.status(201).json({ mensaje: 'Pago creado', id: idPago });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el pago', error: error.message });
    }
};

// Obtener todos los pagos de un contrato
const obtenerPagosPorContrato = async (req, res) => {
    try {
        const { contratoId } = req.params;
        const pagos = await Pago.obtenerPorContrato(contratoId);
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los pagos', error: error.message });
    }
};

// Obtener todos los pagos por inquilino
const obtenerPagosPorInquilino = async (req, res) => {
    try {
        const { dni, nombre } = req.query;
        const pagos = await Pago.obtenerPagosPorInquilino(dni, nombre);
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los pagos', error: error.message });
    }
};

// Obtener un pago por ID
const obtenerPagoPorId = async (req, res) => {
    try {
        const pago = await Pago.obtenerPorId(req.params.id);
        if (!pago) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }
        res.json(pago);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el pago', error: error.message });
    }
};

// Actualizar un pago
const actualizarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Pago.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }
        res.json({ mensaje: 'Pago actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el pago', error: error.message });
    }
};

// Eliminar un pago
const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Pago.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }
        res.json({ mensaje: 'Pago eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el pago', error: error.message });
    }
};

module.exports = {
    crearPago,
    obtenerPagosPorContrato,
    obtenerPagosPorInquilino,
    obtenerPagoPorId,
    actualizarPago,
    eliminarPago,
};