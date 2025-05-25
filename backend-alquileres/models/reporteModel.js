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
            SELECT g.id, g.monto, g.tipo_gasto, g.descripcion, g.creado_en,
                   i.nombre
            FROM gastos g
                     LEFT JOIN inmuebles i ON g.inmueble_id = i.id
            WHERE 1=1
        `;

        const params = [];

        // Filtros opcionales
        if (filtros.fecha_inicio) {
            query += ' AND g.creado_en >= ?';
            params.push(filtros.fecha_inicio);
        }

        if (filtros.fecha_fin) {
            query += ' AND g.creado_en <= ?';
            params.push(filtros.fecha_fin);
        }

        if (filtros.inmueble_id) {
            query += ' AND g.inmueble_id = ?';
            params.push(filtros.inmueble_id);
        }

        if (filtros.tipo_gasto) {
            query += ' AND g.tipo_gasto = ?';
            params.push(filtros.tipo_gasto);
        }

        // Orden final
        query += ' ORDER BY g.creado_en DESC';

        // Ejecutar la consulta
        const [gastos] = await db.query(query, params);
        return gastos;
    }

    // MÉTODOS PARA EL DASHBOARD

    // Total de inquilinos por mes
    static async totalInquilinosPorMes() {
        const query = `
            SELECT 
                DATE_FORMAT(c.fecha_inicio, '%Y-%m') AS mes,
                COUNT(DISTINCT c.inquilino_id) AS total_inquilinos
            FROM 
                contratos c
            WHERE 
                c.fecha_inicio >= DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH)
            GROUP BY 
                DATE_FORMAT(c.fecha_inicio, '%Y-%m')
            ORDER BY 
                mes DESC
            LIMIT 2
        `;
        
        const [resultados] = await db.query(query);
        
        // Calculamos la diferencia y variación porcentual
        let respuesta = {
            data: resultados,
            diferencia: 0,
            variacion_porcentual: 0
        };
        
        if (resultados.length >= 2) {
            const mesActual = resultados[0].total_inquilinos;
            const mesAnterior = resultados[1].total_inquilinos;
            
            respuesta.diferencia = mesActual - mesAnterior;
            respuesta.variacion_porcentual = mesAnterior !== 0 
                ? (respuesta.diferencia / mesAnterior) * 100 
                : 0;
        }
        
        return respuesta;
    }

    // Espacios disponibles vs ocupados
    static async espaciosDisponiblesVsOcupados() {
        const query = `
            SELECT 
                i.id AS inmueble_id,
                i.nombre AS inmueble_nombre,
                COUNT(e.id) AS total_espacios,
                SUM(CASE WHEN EXISTS (
                    SELECT 1 FROM contratos c 
                    WHERE c.espacio_id = e.id 
                    AND c.estado = 'activo'
                ) THEN 1 ELSE 0 END) AS espacios_ocupados,
                SUM(CASE WHEN NOT EXISTS (
                    SELECT 1 FROM contratos c 
                    WHERE c.espacio_id = e.id 
                    AND c.estado = 'activo'
                ) THEN 1 ELSE 0 END) AS espacios_disponibles
            FROM 
                inmuebles i
            JOIN 
                pisos p ON p.inmueble_id = i.id
            JOIN 
                espacios e ON e.piso_id = p.id
            GROUP BY 
                i.id, i.nombre
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Ingresos mensuales
    static async ingresosMensuales() {
        const query = `
            SELECT 
                i.id AS inmueble_id,
                i.nombre AS inmueble_nombre,
                DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes,
                SUM(p.monto) AS total_ingresos
            FROM 
                pagos p
            JOIN 
                contratos c ON p.contrato_id = c.id
            JOIN 
                inmuebles i ON c.inmueble_id = i.id
            WHERE 
                p.estado = 'pagado'
                AND p.fecha_pago >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY 
                i.id, i.nombre, DATE_FORMAT(p.fecha_pago, '%Y-%m')
            ORDER BY 
                mes DESC, i.nombre
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Gastos mensuales
    static async gastosMensuales() {
        const query = `
            SELECT 
                i.id AS inmueble_id,
                i.nombre AS inmueble_nombre,
                DATE_FORMAT(g.fecha, '%Y-%m') AS mes,
                SUM(g.monto) AS total_gastos
            FROM 
                gastos g
            JOIN 
                inmuebles i ON g.inmueble_id = i.id
            WHERE 
                g.fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY 
                i.id, i.nombre, DATE_FORMAT(g.fecha, '%Y-%m')
            ORDER BY 
                mes DESC, i.nombre
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Contratos activos vs mes anterior
    static async contratosActivos() {
        const query = `
            SELECT 
                DATE_FORMAT(NOW(), '%Y-%m') AS mes_actual,
                SUM(CASE WHEN c.estado = 'activo' AND MONTH(c.fecha_inicio) = MONTH(CURRENT_DATE()) THEN 1 ELSE 0 END) AS contratos_activos_mes_actual,
                DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m') AS mes_anterior,
                SUM(CASE WHEN c.estado = 'activo' AND MONTH(c.fecha_inicio) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) THEN 1 ELSE 0 END) AS contratos_activos_mes_anterior
            FROM 
                contratos c
        `;
        
        const [resultados] = await db.query(query);
        
        // Calculamos la diferencia y variación porcentual
        let respuesta = {
            data: resultados[0],
            diferencia: 0,
            variacion_porcentual: 0
        };
        
        if (resultados.length > 0) {
            const mesActual = resultados[0].contratos_activos_mes_actual;
            const mesAnterior = resultados[0].contratos_activos_mes_anterior;
            
            respuesta.diferencia = mesActual - mesAnterior;
            respuesta.variacion_porcentual = mesAnterior !== 0 
                ? (respuesta.diferencia / mesAnterior) * 100 
                : 0;
        }
        
        return respuesta;
    }

    // Tasa de ocupación por inmueble
    static async tasaOcupacion() {
        const query = `
            SELECT 
                i.id AS inmueble_id,
                i.nombre AS inmueble_nombre,
                COUNT(e.id) AS total_unidades,
                SUM(CASE WHEN EXISTS (
                    SELECT 1 FROM contratos c 
                    WHERE c.espacio_id = e.id 
                    AND c.estado = 'activo'
                ) THEN 1 ELSE 0 END) AS unidades_ocupadas,
                (SUM(CASE WHEN EXISTS (
                    SELECT 1 FROM contratos c 
                    WHERE c.espacio_id = e.id 
                    AND c.estado = 'activo'
                ) THEN 1 ELSE 0 END) / COUNT(e.id)) * 100 AS tasa_ocupacion
            FROM 
                inmuebles i
            JOIN 
                pisos p ON p.inmueble_id = i.id
            JOIN 
                espacios e ON e.piso_id = p.id
            GROUP BY 
                i.id, i.nombre
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Contratos por vencer (próximos 30 días)
    static async contratosPorVencer() {
        const query = `
            SELECT 
                c.id,
                c.fecha_inicio,
                c.fecha_fin,
                i.nombre AS inmueble_nombre,
                e.nombre AS espacio_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS inquilino_nombre,
                p.dni AS inquilino_dni,
                DATEDIFF(c.fecha_fin, CURRENT_DATE()) AS dias_restantes
            FROM 
                contratos c
            JOIN 
                inmuebles i ON c.inmueble_id = i.id
            JOIN 
                espacios e ON c.espacio_id = e.id
            JOIN 
                personas p ON c.inquilino_id = p.id
            WHERE 
                c.estado = 'activo'
                AND c.fecha_fin BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)
            ORDER BY 
                c.fecha_fin ASC
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Pagos pendientes vs pagados por mes
    static async pagosPendientesVsPagados() {
        const query = `
            SELECT 
                DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes,
                SUM(CASE WHEN p.estado = 'pagado' THEN p.monto ELSE 0 END) AS monto_pagado,
                SUM(CASE WHEN p.estado = 'pendiente' THEN p.monto ELSE 0 END) AS monto_pendiente
            FROM 
                pagos p
            WHERE 
                p.fecha_pago >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY 
                DATE_FORMAT(p.fecha_pago, '%Y-%m')
            ORDER BY 
                mes DESC
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }

    // Contratos vencidos vs renovados por mes
    static async contratosVencidosVsRenovados() {
        const query = `
            SELECT 
                DATE_FORMAT(c1.fecha_fin, '%Y-%m') AS mes,
                COUNT(DISTINCT c1.id) AS contratos_vencidos,
                SUM(CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM contratos c2 
                        WHERE c2.inquilino_id = c1.inquilino_id 
                        AND c2.espacio_id = c1.espacio_id
                        AND c2.fecha_inicio > c1.fecha_fin
                        AND DATE_FORMAT(c2.fecha_inicio, '%Y-%m') = DATE_FORMAT(c1.fecha_fin, '%Y-%m')
                    ) THEN 1 ELSE 0 END) AS contratos_renovados
            FROM 
                contratos c1
            WHERE 
                c1.fecha_fin < CURRENT_DATE()
                AND c1.fecha_fin >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY 
                DATE_FORMAT(c1.fecha_fin, '%Y-%m')
            ORDER BY 
                mes DESC
        `;
        
        const [resultados] = await db.query(query);
        return resultados;
    }
}

module.exports = Reporte;