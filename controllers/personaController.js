const Persona = require('../models/personaModel');

// Crear una persona
const crearPersona = async (req, res) => {
    try {
        const nuevaPersona = req.body;
        const idPersona = await Persona.crear(nuevaPersona);
        res.status(201).json({ mensaje: 'Persona creada', id: idPersona });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la persona', error: error.message });
    }
};

// Obtener todas las personas
const obtenerPersonas = async (req, res) => {
    try {
        const personas = await Persona.obtenerTodos();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las personas', error: error.message });
    }
};

// Obtener todas las personas
const obtenerInquilinos = async (req, res) => {
    try {
        const personas = await Persona.obtenerInquilinos();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los inquilinos', error: error.message });
    }
};

//obtener persona por documento
const obtenerPersonaPorDocumento = async (req, res) => {
    try {
        const persona = await Persona.obtenerPorDocumento(req.params.dni);
        if (!persona) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json(persona);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la persona', error: error.message });
    }
};

// Obtener una persona por ID
const obtenerPersonaPorId = async (req, res) => {
    try {
        const persona = await Persona.obtenerPorId(req.params.id);
        if (!persona) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json(persona);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la persona', error: error.message });
    }
};

// Obtener una persona por email
const obtenerPersonaPorEmail = async (req, res) => {
    try {
        const persona = await Persona.obtenerPorEmail(req.params.email);
        if (!persona) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json(persona);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la persona', error: error.message });
    }
};

// Actualizar una persona
const actualizarPersona = async (req, res) => {
    try {
        const actualizado = await Persona.actualizar(req.params.id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json({ mensaje: 'Persona actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la persona', error: error.message });
    }
};

// Eliminar una persona
const eliminarPersona = async (req, res) => {
    try {
        const eliminado = await Persona.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }
        res.json({ mensaje: 'Persona eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la persona', error: error.message });
    }
};

module.exports = {
    crearPersona,
    obtenerPersonas,
    obtenerInquilinos,
    obtenerPersonaPorId,
    obtenerPersonaPorEmail,
    actualizarPersona,
    obtenerPersonaPorDocumento,
    eliminarPersona,
};
