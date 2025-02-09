const PagoAdicional = require('../models/pagoAdicionalModel');

// Crear un pago adicional
const crearPagoAdicional = async (req, res) => {
    try {
        const nuevoPagoAdicional = req.body;
        const idPagoAdicional = await PagoAdicional.crear(nuevoPagoAdicional);
        res.status(201).json({ mensaje: 'Pago adicional creado', id: idPagoAdicional });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el pago adicional', error: error.message });
    }
};

// Obtener todos los pagos adicionales de un contrato
const obtenerPagosAdicionalesPorContrato = async (req, res) => {
    try {
        const { contratoId } = req.params;
        const pagos = await PagoAdicional.obtenerPorContrato(contratoId);
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los pagos adicionales', error: error.message });
    }
};

// Obtener un pago adicional por ID
const obtenerPagoAdicionalPorId = async (req, res) => {
    try {
        const pago = await PagoAdicional.obtenerPorId(req.params.id);
        if (!pago) {
            return res.status(404).json({ mensaje: 'Pago adicional no encontrado' });
        }
        res.json(pago);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el pago adicional', error: error.message });
    }
};

// Actualizar un pago adicional
const actualizarPagoAdicional = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await PagoAdicional.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Pago adicional no encontrado' });
        }
        res.json({ mensaje: 'Pago adicional actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el pago adicional', error: error.message });
    }
};

// Eliminar un pago adicional
const eliminarPagoAdicional = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await PagoAdicional.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Pago adicional no encontrado' });
        }
        res.json({ mensaje: 'Pago adicional eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el pago adicional', error: error.message });
    }
};

module.exports = {
    crearPagoAdicional,
    obtenerPagosAdicionalesPorContrato,
    obtenerPagoAdicionalPorId,
    actualizarPagoAdicional,
    eliminarPagoAdicional,
};