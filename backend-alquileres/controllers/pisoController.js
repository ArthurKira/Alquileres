const Piso = require('../models/pisoModel');

// Crear un piso
const crearPiso = async (req, res) => {
    try {
        const nuevoPiso = req.body;
        const idPiso = await Piso.crear(nuevoPiso);
        res.status(201).json({ mensaje: 'Piso creado', id: idPiso });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el piso', error: error.message });
    }
};

// Obtener todos los pisos de un inmueble
const obtenerPisosPorInmueble = async (req, res) => {
    try {
        const { inmuebleId } = req.params;
        const pisos = await Piso.obtenerPorInmueble(inmuebleId);
        res.json(pisos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los pisos', error: error.message });
    }
};

// Obtener un piso por ID
const obtenerPisoPorId = async (req, res) => {
    try {
        const piso = await Piso.obtenerPorId(req.params.id);
        if (!piso) {
            return res.status(404).json({ mensaje: 'Piso no encontrado' });
        }
        res.json(piso);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el piso', error: error.message });
    }
};

// Actualizar un piso
const actualizarPiso = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Piso.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Piso no encontrado' });
        }
        res.json({ mensaje: 'Piso actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el piso', error: error.message });
    }
};

// Eliminar un piso
const eliminarPiso = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Piso.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Piso no encontrado' });
        }
        res.json({ mensaje: 'Piso eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el piso', error: error.message });
    }
};

module.exports = {
    crearPiso,
    obtenerPisosPorInmueble,
    obtenerPisoPorId,
    actualizarPiso,
    eliminarPiso,
};