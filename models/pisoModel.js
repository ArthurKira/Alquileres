const db = require('../config/db');

class Piso {
    // Crear un piso
    static async crear(piso) {
        const { inmueble_id, nombre } = piso;
        const [result] = await db.query(
            'INSERT INTO pisos (inmueble_id, nombre) VALUES (?, ?)',
            [inmueble_id, nombre]
        );
        return result.insertId;
    }

    // Obtener todos los pisos de un inmueble
    static async obtenerPorInmueble(inmuebleId) {
        const [pisos] = await db.query('SELECT * FROM pisos WHERE inmueble_id = ?', [inmuebleId]);
        return pisos;
    }

    // Obtener un piso por ID
    static async obtenerPorId(id) {
        const [pisos] = await db.query('SELECT * FROM pisos WHERE id = ?', [id]);
        return pisos[0];
    }

    // Actualizar un piso
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE pisos SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un piso
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM pisos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Piso;