const db = require('../config/db');

class DetalleReporte {
    // Crear un detalle de reporte
    static async crear(detalleReporte) {
        const { reporte_id, tipo_detalle, descripcion, monto, cantidad } = detalleReporte;
        const [result] = await db.query(
            'INSERT INTO detalles_reportes (reporte_id, tipo_detalle, descripcion, monto, cantidad) VALUES (?, ?, ?, ?, ?)',
            [reporte_id, tipo_detalle, descripcion, monto, cantidad]
        );
        return result.insertId;
    }

    // Obtener todos los detalles de un reporte
    static async obtenerPorReporte(reporteId) {
        const [detalles] = await db.query('SELECT * FROM detalles_reportes WHERE reporte_id = ?', [reporteId]);
        return detalles;
    }

    // Obtener un detalle de reporte por ID
    static async obtenerPorId(id) {
        const [detalles] = await db.query('SELECT * FROM detalles_reportes WHERE id = ?', [id]);
        return detalles[0];
    }

    // Actualizar un detalle de reporte
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE detalles_reportes SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un detalle de reporte
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM detalles_reportes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = DetalleReporte;