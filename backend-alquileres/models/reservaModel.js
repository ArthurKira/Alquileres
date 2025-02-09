const db = require('../config/db');

class Reserva {
    // Crear una reserva
    static async crear(reserva) {
        const { persona_id, habitacion_id, fecha_inicio, fecha_fin, estado } = reserva;
        const [result] = await db.query(
            'INSERT INTO reservas (persona_id, habitacion_id, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
            [persona_id, habitacion_id, fecha_inicio, fecha_fin, estado]
        );
        return result.insertId;
    }

    // Obtener todas las reservas de un usuario
    static async obtenerPorUsuario(personaId) {
        const [reservas] = await db.query(`
      SELECT r.*, e.nombre AS habitacion_nombre 
      FROM reservas r
      JOIN espacios e ON r.habitacion_id = e.id
      WHERE r.persona_id = ?
    `, [personaId]);
        return reservas;
    }

    // Obtener una reserva por ID
    static async obtenerPorId(id) {
        const [reservas] = await db.query(`
      SELECT r.*, e.nombre AS habitacion_nombre 
      FROM reservas r
      JOIN espacios e ON r.habitacion_id = e.id
      WHERE r.id = ?
    `, [id]);
        return reservas[0];
    }

    // Actualizar una reserva
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE reservas SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar una reserva
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM reservas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Reserva;