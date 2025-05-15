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
    
    // Generar reporte de pagos con filtros
    static async reportePagos(filtros = {}) {
        let query = `
            SELECT 
                p.id, 
                p.monto, 
                p.metodo_pago, 
                p.tipo_pago, 
                p.estado, 
                p.fecha_pago,
                p.creado_en,
                i.nombre AS nombre_inmueble, 
                e.nombre AS nombre_espacio,
                per.dni as DNI,
                per.apellido as Apellidos,
                per.nombre as Nombres
            FROM pagos p
            LEFT JOIN contratos c ON c.id = p.contrato_id
            LEFT JOIN inmuebles i ON i.id = c.inmueble_id
            LEFT JOIN espacios e ON e.id = c.espacio_id
            LEFT JOIN personas per ON per.id = c.inquilino_id 
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filtros.fecha_inicio) {
            query += ' AND p.fecha_pago >= ?';
            params.push(filtros.fecha_inicio);
        }
        
        if (filtros.fecha_fin) {
            query += ' AND p.fecha_pago <= ?';
            params.push(filtros.fecha_fin);
        }
        
        if (filtros.inmueble_id) {
            query += ' AND i.id = ?';
            params.push(filtros.inmueble_id);
        }
        
        if (filtros.estado) {
            query += ' AND p.estado = ?';
            params.push(filtros.estado);
        }
        
        query += ' ORDER BY p.creado_en DESC';
        
        const [pagos] = await db.query(query, params);
        return pagos;
    }
    
    // Generar reporte de gastos con filtros
    static async reporteGastos(filtros = {}) {
        let query = `
            SELECT g.id, g.monto, g.metodo_pago, g.tipo_gasto, g.descripcion, g.creado_en,
                   i.nombre
            FROM gastos g
            LEFT JOIN inmuebles i ON g.inmueble_id = i.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filtros.fecha_inicio) {
            query += ' AND g.creado_en >= ?';
            params.push(filtros.fecha_inicio);
        }
        
        if (filtros.fecha_fin) {
            query += ' AND g.creado_en <= ?';
            params.push(filtros.fecha_fin);
        }
        
        if (filtros.inmueble_id) {
            query += ' AND i.id = ?';
            params.push(filtros.inmueble_id);
        }
        
        if (filtros.tipo_gasto) {
            query += ' AND g.tipo_gasto = ?';
            params.push(filtros.tipo_gasto);
        }
        
        query += ' ORDER BY g.creado_en DESC';
        
        const [gastos] = await db.query(query, params);
        return gastos;
    }
}

module.exports = Reporte;