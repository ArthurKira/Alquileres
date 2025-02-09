const db = require('../config/db');

class Pago {
    // Crear un pago
    static async crear(pago) {
        const { contrato_id, monto, metodo_pago, tipo_pago, estado } = pago;
        const [result] = await db.query(
            'INSERT INTO pagos (contrato_id, monto, metodo_pago, tipo_pago, estado) VALUES (?, ?, ?, ?, ?)',
            [contrato_id, monto, metodo_pago, tipo_pago, estado]
        );
        return result.insertId;
    }

    // Obtener todos los pagos de un contrato
    static async obtenerPorContrato(contratoId) {
        const [pagos] = await db.query('SELECT * FROM pagos WHERE contrato_id = ?', [contratoId]);
        return pagos;
    }

    // Obtener un pago por ID
    static async obtenerPorId(id) {
        const [pagos] = await db.query('SELECT * FROM pagos WHERE id = ?', [id]);
        return pagos[0];
    }

    // Actualizar un pago
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE pagos SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un pago
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM pagos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Pago;