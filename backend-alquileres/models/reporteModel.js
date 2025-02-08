const db = require('../config/db');

class Reporte {
    // Crear un reporte
    static async crear(reporte) {
        const { tipo_reporte, descripcion, fecha_inicio, fecha_fin } = reporte;
        const [result] = await db.query(
            'INSERT INTO reportes (tipo_reporte, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
            [tipo_reporte, descripcion, fecha_inicio, fecha_fin]
        );
        return result.insertId;
    }

    // Obtener todos los reportes
    static async obtenerTodos() {
        const [reportes] = await db.query('SELECT * FROM reportes');
        return reportes;
    }

    // Obtener un reporte por ID
    static async obtenerPorId(id) {
        const [reportes] = await db.query('SELECT * FROM reportes WHERE id = ?', [id]);
        return reportes[0];
    }

    // Actualizar un reporte
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE reportes SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un reporte
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM reportes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Reporte;