const db = require('../config/db');

class Gasto {
    // Crear un gasto
    static async crear(gasto) {
        const { inmueble_id, tipo_gasto, descripcion, monto, fecha } = gasto;
        const [result] = await db.query(
            'INSERT INTO gastos (inmueble_id, tipo_gasto, descripcion, monto, fecha) VALUES (?, ?, ?, ?, ?)',
            [inmueble_id, tipo_gasto, descripcion, monto, fecha]
        );
        return result.insertId;
    }

    // Obtener todos los gastos
    static async obtenerTodos() {
        const [gastos] = await db.query(`
            SELECT g.*, i.nombre AS inmueble_nombre
            FROM gastos g
            LEFT JOIN inmuebles i ON g.inmueble_id = i.id
            ORDER BY g.fecha DESC
        `);
        return gastos;
    }

    // Obtener todos los gastos de un inmueble
    static async obtenerPorInmueble(inmuebleId) {
        const [gastos] = await db.query('SELECT * FROM gastos WHERE inmueble_id = ?', [inmuebleId]);
        return gastos;
    }

    // Buscar gastos por término (concepto, inmueble, etc.)
    static async buscar(termino) {
        const terminoBusqueda = `%${termino}%`;
        const [gastos] = await db.query(`
            SELECT g.*, i.nombre AS inmueble_nombre
            FROM gastos g
            LEFT JOIN inmuebles i ON g.inmueble_id = i.id
            WHERE g.descripcion LIKE ? 
               OR i.nombre LIKE ?
               OR g.tipo_gasto LIKE ?
            ORDER BY g.fecha DESC
        `, [terminoBusqueda, terminoBusqueda, terminoBusqueda]);
        return gastos;
    }

    // Obtener un gasto por ID
    static async obtenerPorId(id) {
        const [gastos] = await db.query(`
            SELECT g.*, i.nombre AS inmueble_nombre
            FROM gastos g
            LEFT JOIN inmuebles i ON g.inmueble_id = i.id
            WHERE g.id = ?
        `, [id]);
        return gastos[0];
    }

    // Actualizar un gasto
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE gastos SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un gasto
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM gastos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Gasto;