const db = require('../config/db');

class TipoInmuebleModel {
    // Crear un tipo de inmueble
    static async crear(nombre) {
        const [result] = await db.query(
            'INSERT INTO tipoInmueble (nombre) VALUES (?)',
            [nombre]
        );
        return result.insertId;
    }

    // Obtener todos los tipos de inmuebles
    static async obtenerTodos() {
        const [tipos] = await db.query('SELECT * FROM tipoInmueble');
        return tipos;
    }

    // Obtener un tipo de inmueble por ID
    static async obtenerPorId(id) {
        const [tipos] = await db.query('SELECT * FROM tipoInmueble WHERE id = ?', [id]);
        return tipos[0];
    }

    // Actualizar un tipo de inmueble
    static async actualizar(id, nombre) {
        const [result] = await db.query(
            'UPDATE tipoInmueble SET nombre = ? WHERE id = ?',
            [nombre, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un tipo de inmueble
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM tipoInmueble WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = TipoInmuebleModel;