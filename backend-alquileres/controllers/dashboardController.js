const db = require('../config/db');

// Obtener estadísticas de espacios alquilados
const obtenerEstadisticasEspacios = async (req, res) => {
    try {
        const [resultados] = await db.query(`
            SELECT 
                COUNT(*) as total_espacios,
                SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) as espacios_alquilados,
                SUM(CASE WHEN estado = 0 THEN 1 ELSE 0 END) as espacios_vacios
            FROM espacios
        `);
        res.json(resultados[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener estadísticas de espacios', error: error.message });
    }
};

// Obtener cantidad de inquilinos
const obtenerCantidadInquilinos = async (req, res) => {
    try {
        const [resultados] = await db.query(`
            SELECT COUNT(DISTINCT inquilino_id) as total_inquilinos
            FROM contratos
            WHERE estado = 1
        `);
        res.json(resultados[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener cantidad de inquilinos', error: error.message });
    }
};

// Obtener resumen de pagos y gastos
const obtenerResumenFinanciero = async (req, res) => {
    try {
        const [resultados] = await db.query(`
            SELECT 
                (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 1) as total_pagos,
                (SELECT COALESCE(SUM(monto), 0) FROM gastos) as total_gastos
        `);
        res.json(resultados[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener resumen financiero', error: error.message });
    }
};

// Obtener inquilinos con pagos atrasados
const obtenerInquilinosPagosAtrasados = async (req, res) => {
    try {
        const { mes, año } = req.query;
        const [resultados] = await db.query(`
            SELECT 
                c.id as contrato_id,
                i.nombre as inquilino_nombre,
                i.apellido as inquilino_apellido,
                e.nombre as espacio_nombre,
                c.fecha_pago,
                c.monto_alquiler
            FROM contratos c
            JOIN inquilinos i ON c.inquilino_id = i.id
            JOIN espacios e ON c.espacio_id = e.id
            WHERE c.estado = 1
            AND (
                c.fecha_pago < CURDATE()
                OR (
                    MONTH(c.fecha_pago) = ? 
                    AND YEAR(c.fecha_pago) = ?
                    AND NOT EXISTS (
                        SELECT 1 FROM pagos p 
                        WHERE p.contrato_id = c.id 
                        AND MONTH(p.fecha_creacion) = ?
                        AND YEAR(p.fecha_creacion) = ?
                    )
                )
            )
        `, [mes, año, mes, año]);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener inquilinos con pagos atrasados', error: error.message });
    }
};

// Obtener estadísticas mensuales de pagos
const obtenerEstadisticasMensuales = async (req, res) => {
    try {
        const { año } = req.query;
        const [resultados] = await db.query(`
            SELECT 
                MONTH(fecha_creacion) as mes,
                SUM(monto) as total_pagos,
                COUNT(*) as cantidad_pagos
            FROM pagos
            WHERE YEAR(fecha_creacion) = ?
            GROUP BY MONTH(fecha_creacion)
            ORDER BY mes
        `, [año]);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener estadísticas mensuales', error: error.message });
    }
};

module.exports = {
    obtenerEstadisticasEspacios,
    obtenerCantidadInquilinos,
    obtenerResumenFinanciero,
    obtenerInquilinosPagosAtrasados,
    obtenerEstadisticasMensuales
}; 