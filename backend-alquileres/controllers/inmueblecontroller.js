const Inmueble = require('../models/inmuebleModel');

// Crear un inmueble
const crearInmueble = async (req, res) => {
    try {
        const nuevoInmueble = req.body;
        const idInmueble = await Inmueble.crear(nuevoInmueble);
        res.status(201).json({ mensaje: 'Inmueble creado', id: idInmueble });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el inmueble', error: error.message });
    }
};

// Obtener todos los inmuebles
const obtenerInmuebles = async (req, res) => {
    try {
        const inmuebles = await Inmueble.obtenerTodos();
        res.json(inmuebles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los inmuebles', error: error.message });
    }
};

// Obtener un inmueble por ID
const obtenerInmueblePorId = async (req, res) => {
    try {
        const inmueble = await Inmueble.obtenerPorId(req.params.id);
        if (!inmueble) {
            return res.status(404).json({ mensaje: 'Inmueble no encontrado' });
        }
        res.json(inmueble);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el inmueble', error: error.message });
    }
};

// Actualizar un inmueble
const actualizarInmueble = async (req, res) => {
    try {
        const actualizado = await Inmueble.actualizar(req.params.id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Inmueble no encontrado' });
        }
        res.json({ mensaje: 'Inmueble actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el inmueble', error: error.message });
    }
};

// Eliminar un inmueble
const eliminarInmueble = async (req, res) => {
    try {
        const eliminado = await Inmueble.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Inmueble no encontrado' });
        }
        res.json({ mensaje: 'Inmueble eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el inmueble', error: error.message });
    }
};

module.exports = {
    crearInmueble,
    obtenerInmuebles,
    obtenerInmueblePorId,
    actualizarInmueble,
    eliminarInmueble,
};