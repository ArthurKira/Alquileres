const db = require('../config/db');

class Contrato {
    // Crear un contrato
    static async crear(contrato) {
        try {
            const { inquilino_id, espacio_id, inmueble_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago } = contrato;
            
            const [result] = await db.query(
                'INSERT INTO contratos (inquilino_id, espacio_id, inmueble_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [inquilino_id, espacio_id, inmueble_id, fecha_inicio, fecha_fin, monto_alquiler, monto_garantia, descripcion, documento, estado, fecha_pago]
            );
            
            return result.insertId;
        } catch (error) {
            throw new Error(`Error al crear el contrato: ${error.message}`);
        }
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
        try {
            const [contratos] = await db.query('SELECT * FROM contratos WHERE inquilino_id = ?', [inquilinoId]);
            return contratos;
        } catch (error) {
            throw new Error(`Error al obtener los contratos del inquilino: ${error.message}`);
        }
    }

    // Obtener todos los contratos de un inmueble
    static async obtenerPorInmueble(inmuebleId) {
        try {
            const [contratos] = await db.query('SELECT * FROM contratos WHERE inmueble_id = ?', [inmuebleId]);
            return contratos;
        } catch (error) {
            throw new Error(`Error al obtener los contratos del inmueble: ${error.message}`);
        }
    }

    // Obtener un contrato por ID
    static async obtenerPorId(id) {
        try {
            const [contratos] = await db.query(`
                SELECT c.*,
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
                WHERE c.id = ?
            `, [id]);
            
            if (!contratos || contratos.length === 0) {
                return null;
            }
            
            return contratos[0];
        } catch (error) {
            throw new Error(`Error al obtener el contrato: ${error.message}`);
        }
    }

    // Actualizar un contrato
    static async actualizar(id, nuevosDatos) {
        try {
            const campos = Object.keys(nuevosDatos);
            const valores = Object.values(nuevosDatos);
            const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

            const [result] = await db.query(
                `UPDATE contratos SET ${actualizaciones} WHERE id = ?`,
                [...valores, id]
            );
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return true;
        } catch (error) {
            throw new Error(`Error al actualizar el contrato: ${error.message}`);
        }
    }

    // Eliminar un contrato
    static async eliminar(id) {
        try {
            const [result] = await db.query('DELETE FROM contratos WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return null;
            }
            
            return true;
        } catch (error) {
            throw new Error(`Error al eliminar el contrato: ${error.message}`);
        }
    }

    // Obtener todos los contratos con detalles
    static async obtenerContratosDetalles() {
        try {
            const [contratos] = await db.query(`
                SELECT 
                    c.*,
                    p.nombre as inquilino_nombre,
                    p.apellido as inquilino_apellido,
                    p.email as inquilino_email,
                    p.telefono as inquilino_telefono,
                    p.dni as inquilino_dni,
                    i.nombre as inmueble_nombre,
                    e.nombre as espacio_nombre
                FROM contratos c
                LEFT JOIN personas p ON c.inquilino_id = p.id
                LEFT JOIN espacios e ON c.espacio_id = e.id
                LEFT JOIN inmuebles i ON c.inmueble_id = i.id
                ORDER BY c.fecha_inicio DESC
            `);
            return contratos;
        } catch (error) {
            throw new Error(`Error al obtener los contratos con detalles: ${error.message}`);
        }
    }
}

module.exports = Contrato;