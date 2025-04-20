const db = require('../config/db');

class TipoEspacio {
    // Crear un tipo de espacio
    static async crear(nombre) {
        const [result] = await db.query(
            'INSERT INTO tipoEspacios (nombre) VALUES (?)',
            [nombre]
        );
        return result.insertId;
    }

    // Obtener todos los tipos de espacios
    static async obtenerTodos() {
        const [tipos] = await db.query('SELECT * FROM tipoEspacios');
        return tipos;
    }

    // Obtener un tipo de espacio por ID
    static async obtenerPorId(id) {
        const [tipos] = await db.query('SELECT * FROM tipoEspacios WHERE id = ?', [id]);
        return tipos[0];
    }

    // Actualizar un tipo de espacio
    static async actualizar(id, nombre) {
        const [result] = await db.query(
            'UPDATE tipoEspacios SET nombre = ? WHERE id = ?',
            [nombre, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un tipo de espacio
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM tipoEspacios WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = TipoEspacio;