const Espacio = require('../models/espacioModels');

// Obtener todos los espacios de un piso
const obtenerEspaciosPorPiso = async (req, res) => {
    try {
        const { pisoId } = req.params;
        const espacios = await Espacio.obtenerPorPiso(pisoId);
        res.json(espacios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los espacios', error: error.message });
    }
};

// Obtener todos los espacios
const obtenerEspacios = async (req, res) => {
    try {
        const espacios = await Espacio.obtenerEspacioCompleto();
        console.log('Espacios obtenidos del modelo:', espacios);
        res.json(espacios);
    } catch (error) {
        console.error('Error al obtener los espacios:', error);
        res.status(500).json({ mensaje: 'Error al obtener los espacios', error: error.message });
    }
};

// Obetener todos los espacios ocupados
//const obtenerEspaciosOcupados = async (req, res) => {
//    try {
//        const espacios = await Espacio.obtenerOcupados(); // Asegúrate de que el modelo Espacio tenga este método
//        res.json(espacios);
//    } catch (error) {
//        res.status(500).json({ mensaje: 'Error al obtener los espacios ocupados', error: error.message });
//    }
//};

// Obtener un espacio por ID
const obtenerEspacioPorId = async (req, res) => {
    try {
        const { espacioId } = req.params;
        const espacio = await Espacio.obtenerPorId(espacioId);
        if (!espacio) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        res.json(espacio);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el espacio', error: error.message });
    }
};

// Obtener todos los espacios con información completa
const obtenerEspacio = async (req, res) => {
    try {
        const espacios = await Espacio.obtenerEspacioCompleto();
        console.log('Espacios con información completa:', espacios);
        res.json(espacios);
    } catch (error) {
        console.error('Error al obtener los espacios:', error);
        res.status(500).json({ mensaje: 'Error al obtener los espacios', error: error.message });
    }
};

// Crear un espacio en un piso
const crearEspacio = async (req, res) => {
    try {
        const { pisoId } = req.params;
        const nuevoEspacio = { ...req.body, piso_id: pisoId };
        const idEspacio = await Espacio.crear(nuevoEspacio);
        res.status(201).json({ mensaje: 'Espacio creado', id: idEspacio });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el espacio', error: error.message });
    }
};

// Actualizar un espacio
const actualizarEspacio = async (req, res) => {
    try {
        const { espacioId } = req.params;
        const actualizado = await Espacio.actualizar(espacioId, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        res.json({ mensaje: 'Espacio actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el espacio', error: error.message });
    }
};

// Eliminar un espacio
const eliminarEspacio = async (req, res) => {
    try {
        const { espacioId } = req.params;
        const eliminado = await Espacio.eliminar(espacioId);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }
        res.json({ mensaje: 'Espacio eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el espacio', error: error.message });
    }
};

// Cambiar el estado de un espacio
const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea 0 o 1 (números que corresponden a la BD)
        if (![0, 1].includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado no válido. Debe ser 0 (disponible) o 1 (ocupado)'
            });
        }

        const actualizado = await Espacio.actualizarEstado(id, estado);

        if (!actualizado) {
            return res.status(404).json({
                mensaje: 'Espacio no encontrado'
            });
        }

        res.json({
            mensaje: 'Estado actualizado exitosamente',
            estado: estado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar estado',
            error: error.message
        });
    }
};

module.exports = {
    obtenerEspaciosPorPiso,
    obtenerEspacioPorId,
    obtenerEspacios,
    crearEspacio,
    actualizarEspacio,
    eliminarEspacio,
    obtenerEspacio,
    cambiarEstado
};