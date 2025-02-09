const Contrato = require('../models/contratoModel');

// Crear un contrato
const crearContrato = async (req, res) => {
    try {
        const nuevoContrato = req.body;
        const idContrato = await Contrato.crear(nuevoContrato);
        res.status(201).json({ mensaje: 'Contrato creado', id: idContrato });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el contrato', error: error.message });
    }
};

// Obtener todos los contratos de un inquilino
const obtenerContratosPorInquilino = async (req, res) => {
    try {
        const { inquilinoId } = req.params;
        const contratos = await Contrato.obtenerPorInquilino(inquilinoId);
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los contratos', error: error.message });
    }
};

// Obtener todos los contratos de un propietario
const obtenerContratosPorPropietario = async (req, res) => {
    try {
        const { propietarioId } = req.params;
        const contratos = await Contrato.obtenerPorPropietario(propietarioId);
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los contratos', error: error.message });
    }
};

// Obtener un contrato por ID
const obtenerContratoPorId = async (req, res) => {
    try {
        const contrato = await Contrato.obtenerPorId(req.params.id);
        if (!contrato) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }
        res.json(contrato);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el contrato', error: error.message });
    }
};

// Actualizar un contrato
const actualizarContrato = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Contrato.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }
        res.json({ mensaje: 'Contrato actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el contrato', error: error.message });
    }
};

// Eliminar un contrato
const eliminarContrato = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Contrato.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }
        res.json({ mensaje: 'Contrato eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el contrato', error: error.message });
    }
};

module.exports = {
    crearContrato,
    obtenerContratosPorInquilino,
    obtenerContratosPorPropietario,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato,
};