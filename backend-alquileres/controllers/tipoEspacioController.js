const TipoEspacio = require('../models/tipoEspacioModel');

// Crear un tipo de espacio
const crearTipoEspacio = async (req, res) => {
    try {
        const { nombre } = req.body;
        const idTipoEspacio = await TipoEspacio.crear(nombre);
        res.status(201).json({ mensaje: 'Tipo de espacio creado', id: idTipoEspacio });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el tipo de espacio', error: error.message });
    }
};

// Obtener todos los tipos de espacios
const obtenerTiposEspacio = async (req, res) => {
    try {
        const tipos = await TipoEspacio.obtenerTodos();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los tipos de espacios', error: error.message });
    }
};

// Obtener un tipo de espacio por ID
const obtenerTipoEspacioPorId = async (req, res) => {
    try {
        const tipo = await TipoEspacio.obtenerPorId(req.params.id);
        if (!tipo) {
            return res.status(404).json({ mensaje: 'Tipo de espacio no encontrado' });
        }
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el tipo de espacio', error: error.message });
    }
};

// Actualizar un tipo de espacio
const actualizarTipoEspacio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const actualizado = await TipoEspacio.actualizar(id, nombre);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Tipo de espacio no encontrado' });
        }
        res.json({ mensaje: 'Tipo de espacio actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el tipo de espacio', error: error.message });
    }
};

// Eliminar un tipo de espacio
const eliminarTipoEspacio = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await TipoEspacio.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Tipo de espacio no encontrado' });
        }
        res.json({ mensaje: 'Tipo de espacio eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el tipo de espacio', error: error.message });
    }
};

module.exports = {
    crearTipoEspacio,
    obtenerTiposEspacio,
    obtenerTipoEspacioPorId,
    actualizarTipoEspacio,
    eliminarTipoEspacio,
};