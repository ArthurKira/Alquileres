const Contrato = require('../models/contratoModel');

// Crear un contrato
const crearContrato = async (req, res) => {
    try {
        const nuevoContrato = req.body;
        const idContrato = await Contrato.crear(nuevoContrato);
        res.status(201).json({ mensaje: 'Contrato creado exitosamente', id: idContrato });
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
        res.status(500).json({ mensaje: 'Error al obtener los contratos del inquilino', error: error.message });
    }
};

// Obtener todos los contratos de un inmueble
const obtenerContratosPorInmueble = async (req, res) => {
    try {
        const { inmuebleId } = req.params;
        const contratos = await Contrato.obtenerPorInmueble(inmuebleId);
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los contratos del inmueble', error: error.message });
    }
};

// Obtener un contrato por ID
const obtenerContratoPorId = async (req, res) => {
    try {
        const contrato = await Contrato.obtenerPorId(req.params.id);
        if (!contrato) {
            return res.status(404).json({ mensaje: 'No se encontró el contrato solicitado' });
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
            return res.status(404).json({ mensaje: 'No se encontró el contrato a actualizar' });
        }
        res.json({ mensaje: 'Contrato actualizado exitosamente' });
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
            return res.status(404).json({ mensaje: 'No se encontró el contrato a eliminar' });
        }
        res.json({ mensaje: 'Contrato eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el contrato', error: error.message });
    }
};

// Obtener todos los contratos con información relacionada
const obtenerContratosConInfo = async (req, res) => {
    try {
        console.log('Solicitud recibida para obtener contratos con información');
        
        const contratos = await Contrato.obtenerContratosConInfo();
        console.log('Contratos obtenidos del modelo:', contratos);
        
        // Aseguramos que siempre devolvamos un array, incluso si está vacío
        const respuesta = Array.isArray(contratos) ? contratos : [];
        
        // Devolvemos la respuesta en el formato que espera el frontend
        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error en el controlador obtenerContratosConInfo:', error);
        res.status(500).json([]);
    }
};

module.exports = {
    crearContrato,
    obtenerContratosPorInquilino,
    obtenerContratosPorInmueble,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato,
    obtenerContratosConInfo
};