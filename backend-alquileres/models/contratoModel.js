const db = require('../config/db');

class Contrato {
    // Crear un contrato
    static async crear(contrato) {
        const { inquilino_id, espacio_id, propietario_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago, tipo_contrato } = contrato;
        const [result] = await db.query(
            'INSERT INTO contratos (inquilino_id, espacio_id, propietario_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago, tipo_contrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [inquilino_id, espacio_id, propietario_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago, tipo_contrato]
        );
        return result.insertId;
    }

    // Obtener todos los contratos de un inquilino
    static async obtenerPorInquilino(inquilinoId) {
        const [contratos] = await db.query('SELECT * FROM contratos WHERE inquilino_id = ?', [inquilinoId]);
        return contratos;
    }

    // Obtener todos los contratos de un propietario
    static async obtenerPorPropietario(propietarioId) {
        const [contratos] = await db.query('SELECT * FROM contratos WHERE propietario_id = ?', [propietarioId]);
        return contratos;
    }

    // Obtener un contrato por ID
    static async obtenerPorId(id) {
        const [contratos] = await db.query('SELECT * FROM contratos WHERE id = ?', [id]);
        return contratos[0];
    }

    // Actualizar un contrato
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE contratos SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un contrato
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM contratos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Contrato;