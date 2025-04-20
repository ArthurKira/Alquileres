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

    // Obtener todos los contratos
    static async obtenerTodos() {
        const [contratos] = await db.query('SELECT * FROM contratos');
        return contratos;
    }

    // Obtener contratos con información detallada
    static async obtenerConInformacion() {
        const [contratos] = await db.query(`
            SELECT
                c.id,
                c.fecha_inicio,
                c.fecha_fin,
                c.monto_alquiler,
                c.monto_garantia,
                c.descripcion,
                c.documento,
                c.estado,
                c.fecha_pago,
                p.dni AS inquilino_dni,
                p.nombre AS inquilino_nombre,
                p.apellido AS inquilino_apellido,
                p.email AS inquilino_email,
                p.telefono AS inquilino_telefono,
                i.nombre AS inmueble_nombre,
                e.nombre AS espacio_nombre,
                e.descripcion AS espacio_descripcion,
                e.precio AS espacio_precio
            FROM contratos c
            LEFT JOIN personas p ON c.inquilino_id = p.id
            LEFT JOIN inmuebles i ON c.inmueble_id = i.id
            LEFT JOIN espacios e ON c.espacio_id = e.id
            ORDER BY c.id DESC
        `);
        return contratos;
    }

    // Obtener contratos con información detallada por inquilino(dni o nombre)
    static async obtenerPorInquilinoConInformacion(dni = null, nombre = null) {
        let sql = `
            SELECT
                c.id,
                c.fecha_inicio,
                c.fecha_fin,
                c.monto_alquiler,
                c.monto_garantia,
                c.descripcion,
                c.documento,
                c.estado,
                c.fecha_pago,
                p.dni AS inquilino_dni,
                p.nombre AS inquilino_nombre,
                p.apellido AS inquilino_apellido,
                p.email AS inquilino_email,
                p.telefono AS inquilino_telefono,
                i.nombre AS inmueble_nombre,
                e.nombre AS espacio_nombre,
                e.descripcion AS espacio_descripcion,
                e.precio AS espacio_precio
            FROM contratos c
            LEFT JOIN personas p ON c.inquilino_id = p.id
            LEFT JOIN inmuebles i ON c.inmueble_id = i.id
            LEFT JOIN espacios e ON c.espacio_id = e.id
        `;

        const params = [];
        const conditions = [];

        if (dni) {
            conditions.push('p.dni = ?');
            params.push(dni);
        }

        if (nombre) {
            conditions.push('(p.nombre LIKE ? OR p.apellido LIKE ?)');
            params.push(`%${nombre}%`);
            params.push(`%${nombre}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' OR ');
        }

        sql += ' ORDER BY c.id DESC';

        const [contratos] = await db.query(sql, params);
        return contratos;
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