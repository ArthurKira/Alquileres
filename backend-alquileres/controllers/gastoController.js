const Gasto = require('../models/gastosModel');

// Crear un gasto
const crearGasto = async (req, res) => {
    try {
        const nuevoGasto = req.body;
        const idGasto = await Gasto.crear(nuevoGasto);
        res.status(201).json({ mensaje: 'Gasto creado', id: idGasto });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el gasto', error: error.message });
    }
};

// Obtener todos los gastos
const obtenerGastos = async (req, res) => {
    try {
        const gastos = await Gasto.obtenerTodos();
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los gastos', error: error.message });
    }
};

// Obtener todos los gastos de un inmueble
const obtenerGastosPorInmueble = async (req, res) => {
    try {
        const { inmuebleId } = req.params;
        const gastos = await Gasto.obtenerPorInmueble(inmuebleId);
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los gastos', error: error.message });
    }
};

// Buscar gastos por término
const buscarGastos = async (req, res) => {
    try {
        const { termino } = req.query;
        if (!termino) {
            return res.status(400).json({ mensaje: 'Se requiere un término de búsqueda' });
        }
        const gastos = await Gasto.buscar(termino);
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar gastos', error: error.message });
    }
};

// Obtener un gasto por ID
const obtenerGastoPorId = async (req, res) => {
    try {
        const gasto = await Gasto.obtenerPorId(req.params.id);
        if (!gasto) {
            return res.status(404).json({ mensaje: 'Gasto no encontrado' });
        }
        res.json(gasto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el gasto', error: error.message });
    }
};

// Actualizar un gasto
const actualizarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Gasto.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Gasto no encontrado' });
        }
        res.json({ mensaje: 'Gasto actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el gasto', error: error.message });
    }
};

// Eliminar un gasto
const eliminarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Gasto.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Gasto no encontrado' });
        }
        res.json({ mensaje: 'Gasto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el gasto', error: error.message });
    }
};

module.exports = {
    crearGasto,
    obtenerGastos,
    obtenerGastosPorInmueble,
    buscarGastos,
    obtenerGastoPorId,
    actualizarGasto,
    eliminarGasto,
};