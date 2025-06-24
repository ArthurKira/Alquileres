const db = require('../config/db');

class Espacio {
    // Crear un espacio
    static async crear(espacio) {
        const { piso_id, tipoEspacio_id, nombre, descripcion, precio, capacidad, baño, estado } = espacio;
        const [result] = await db.query(
            'INSERT INTO espacios (piso_id, tipoEspacio_id, nombre, descripcion, precio, capacidad, baño, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [piso_id, tipoEspacio_id, nombre, descripcion, precio, capacidad, baño, estado]
        );
        return result.insertId;
    }

    // Obtener todos los espacios
    static async obtenerTodos() {
        const [espacios] = await db.query('SELECT * FROM espacios');
        return espacios;
    }


    // Obtener todos los espacios de un piso
    static async obtenerPorPiso(pisoId) {
        const [espacios] = await db.query(`
            SELECT e.*, t.nombre AS tipo_espacio
            FROM espacios e
                     JOIN tipoEspacios t ON e.tipoEspacio_id = t.id
            WHERE e.piso_id = ?
        `, [pisoId]);
        return espacios;
    }



    // Obtener un espacio por ID
    static async obtenerPorId(id) {
        const [espacios] = await db.query(`
      SELECT e.*, t.nombre AS tipo_espacio 
      FROM espacios e
      JOIN tipoEspacios t ON e.tipoEspacio_id = t.id
      WHERE e.id = ?
    `, [id]);
        return espacios[0];
    }

    // Actualizar un espacio
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE espacios SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un espacio
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM espacios WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Actualizar solo el estado de un espacio
    static async actualizarEstado(id, estado) {
        const [result] = await db.query(
            'UPDATE espacios SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    }

    // Obtener todos los espacios con información completa
    static async obtenerEspacioCompleto() {
        try {
            const query = `
                SELECT 
                    e.*,
                    t.nombre AS tipo_espacio,
                    p.nombre AS piso_nombre,
                    i.nombre AS inmueble_nombre
                FROM espacios e
                LEFT JOIN tipoEspacios t ON e.tipoEspacio_id = t.id
                LEFT JOIN pisos p ON e.piso_id = p.id
                LEFT JOIN inmuebles i ON p.inmueble_id = i.id
            `;
            
            const [espacios] = await db.query(query);
            console.log('Query ejecutada:', query);
            console.log('Resultados de la base de datos:', espacios);
            return espacios;
        } catch (error) {
            console.error('Error en obtenerEspacioCompleto:', error);
            throw error;
        }
    }

    // Mantener el método original para compatibilidad
    static async obtenerEspacio() {
        return this.obtenerEspacioCompleto();
    }
}

module.exports = Espacio;