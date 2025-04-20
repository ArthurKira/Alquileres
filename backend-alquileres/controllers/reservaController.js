const Reserva = require('../models/reservaModel');

// Crear una reserva
const crearReserva = async (req, res) => {
    try {
        const nuevaReserva = req.body;
        const idReserva = await Reserva.crear(nuevaReserva);
        res.status(201).json({ mensaje: 'Reserva creada', id: idReserva });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la reserva', error: error.message });
    }
};

// Obtener reservas de un usuario
const obtenerReservasPorUsuario = async (req, res) => {
    try {
        const { personaId } = req.params;
        const reservas = await Reserva.obtenerPorUsuario(personaId);
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las reservas', error: error.message });
    }
};

// Obtener una reserva por ID
const obtenerReservaPorId = async (req, res) => {
    try {
        const reserva = await Reserva.obtenerPorId(req.params.id);
        if (!reserva) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la reserva', error: error.message });
    }
};

// Actualizar una reserva
const actualizarReserva = async (req, res) => {
    try {
        const actualizado = await Reserva.actualizar(req.params.id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }
        res.json({ mensaje: 'Reserva actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la reserva', error: error.message });
    }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
    try {
        const eliminado = await Reserva.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }
        res.json({ mensaje: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la reserva', error: error.message });
    }
};

module.exports = {
    crearReserva,
    obtenerReservasPorUsuario,
    obtenerReservaPorId,
    actualizarReserva,
    eliminarReserva,
};