const TipoInmueble = require('../models/tipoInmuebleModel');

// Crear un tipo de inmueble
const crearTipoInmueble = async (req, res) => {
    try {
        const { nombre } = req.body;
        const idTipoInmueble = await TipoInmueble.crear(nombre);
        res.status(201).json({ mensaje: 'Tipo de inmueble creado', id: idTipoInmueble });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el tipo de inmueble', error: error.message });
    }
};

// Obtener todos los tipos de inmuebles
const obtenerTiposInmueble = async (req, res) => {
    try {
        const tipos = await TipoInmueble.obtenerTodos();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los tipos de inmuebles', error: error.message });
    }
};

// Obtener un tipo de inmueble por ID
const obtenerTipoInmueblePorId = async (req, res) => {
    try {
        const tipo = await TipoInmueble.obtenerPorId(req.params.id);
        if (!tipo) {
            return res.status(404).json({ mensaje: 'Tipo de inmueble no encontrado' });
        }
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el tipo de inmueble', error: error.message });
    }
};

// Actualizar un tipo de inmueble
const actualizarTipoInmueble = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const actualizado = await TipoInmueble.actualizar(id, nombre);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Tipo de inmueble no encontrado' });
        }
        res.json({ mensaje: 'Tipo de inmueble actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el tipo de inmueble', error: error.message });
    }
};

// Eliminar un tipo de inmueble
const eliminarTipoInmueble = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await TipoInmueble.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Tipo de inmueble no encontrado' });
        }
        res.json({ mensaje: 'Tipo de inmueble eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el tipo de inmueble', error: error.message });
    }
};

module.exports = {
    crearTipoInmueble,
    obtenerTiposInmueble,
    obtenerTipoInmueblePorId,
    actualizarTipoInmueble,
    eliminarTipoInmueble,
};