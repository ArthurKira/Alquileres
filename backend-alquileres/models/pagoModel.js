const db = require('../config/db');

class Pago {
    // Crear un pago
    static async crear(pago) {
        const { contrato_id, monto, metodo_pago, tipo_pago, estado, fecha_pago, fecha_real_pago, observacion } = pago;
        const [result] = await db.query(
            'INSERT INTO pagos (contrato_id, monto, metodo_pago, tipo_pago, estado, fecha_pago, fecha_real_pago, observacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [contrato_id, monto, metodo_pago, tipo_pago, estado, fecha_pago, fecha_real_pago, observacion]
        );
        return result.insertId;
    }

    // Obtener todos los pagos
    static async obtenerTodos() {
        const [pagos] = await db.query(`
            SELECT
                pagos.id,
                pagos.contrato_id,
                pagos.monto,
                pagos.metodo_pago,
                pagos.tipo_pago,
                pagos.estado,
                pagos.fecha_pago,
                pagos.fecha_real_pago,
                pagos.observacion,
                contratos.inquilino_id,
                personas.nombre AS inquilino_nombre,
                personas.apellido AS inquilino_apellido,
                personas.dni AS inquilino_dni
            FROM pagos
            LEFT JOIN contratos ON pagos.contrato_id = contratos.id
            LEFT JOIN personas ON contratos.inquilino_id = personas.id
            ORDER BY pagos.id DESC
        `);
        return pagos;
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

    //Obtener todos los pagos por inquilino
    static async obtenerPagosPorInquilino(dni = null, nombre = null) {
        let sql = `
            SELECT
                pagos.id,
                pagos.contrato_id,
                pagos.monto,
                pagos.metodo_pago,
                pagos.tipo_pago,
                pagos.estado,
                pagos.fecha_pago,
                pagos.fecha_real_pago,
                contratos.inquilino_id,
                personas.nombre AS inquilino_nombre,
                personas.apellido AS inquilino_apellido,
                personas.dni AS inquilino_dni
            FROM pagos
            LEFT JOIN contratos ON pagos.contrato_id = contratos.id
            LEFT JOIN personas ON contratos.inquilino_id = personas.id
        `;

        const params = [];
        const conditions = [];

        // Si se proporciona un DNI, agregamos la condición correspondiente
        if (dni) {
            conditions.push('personas.dni = ?');
            params.push(dni);
        }

        // Si se proporciona un nombre, buscamos por nombre o apellido
        if (nombre) {
            conditions.push('(personas.nombre LIKE ? OR personas.apellido LIKE ?)');
            params.push(`%${nombre}%`);
            params.push(`%${nombre}%`);
        }

        // Si hay condiciones de búsqueda, las agregamos a la consulta
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' OR ');
        }

        // Ordenamos los resultados por el ID de los pagos en orden descendente
        sql += ' ORDER BY pagos.id DESC';

        // Ejecutamos la consulta con los parámetros adecuados
        const [pagos] = await db.query(sql, params);
        return pagos;
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