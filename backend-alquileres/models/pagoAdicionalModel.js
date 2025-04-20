const db = require('../config/db');

class PagoAdicional {
    // Crear un pago adicional
    static async crear(pagoAdicional) {
        const { contrato_id, tipo_servicio, monto, fecha_pago } = pagoAdicional;
        const [result] = await db.query(
            'INSERT INTO pagos_adicionales (contrato_id, tipo_servicio, monto, fecha_pago) VALUES (?, ?, ?, ?)',
            [contrato_id, tipo_servicio, monto, fecha_pago]
        );
        return result.insertId;
    }

    // Obtener todos los pagos adicionales de un contrato
    static async obtenerPorContrato(contratoId) {
        const [pagos] = await db.query('SELECT * FROM pagos_adicionales WHERE contrato_id = ?', [contratoId]);
        return pagos;
    }

    // Obtener un pago adicional por ID
    static async obtenerPorId(id) {
        const [pagos] = await db.query('SELECT * FROM pagos_adicionales WHERE id = ?', [id]);
        return pagos[0];
    }

    // Actualizar un pago adicional
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE pagos_adicionales SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un pago adicional
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM pagos_adicionales WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = PagoAdicional;