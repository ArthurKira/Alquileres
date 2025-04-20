const db = require('../config/db');

class Inmueble {
    // Crear un inmueble
    static async crear(inmueble) {
        const { propietario_id, tipoInmueble_id, nombre, descripcion, direccion, ubigeo, cantidad_pisos, estado } = inmueble;
        const [result] = await db.query(
            'INSERT INTO inmuebles (propietario_id, tipoInmueble_id, nombre, descripcion, direccion, ubigeo, cantidad_pisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [propietario_id, tipoInmueble_id, nombre, descripcion, direccion, ubigeo, cantidad_pisos, estado]
        );
        return result.insertId;
    }

    //Obtener inmuebles por propietario
    static async obtenerPorPropietario(propietarioId) {
        const [inmuebles] = await db.query('SELECT * FROM inmuebles WHERE propietario_id = ?', [propietarioId]);
        return inmuebles;
    }

    // Obtener todos los inmuebles
    static async obtenerTodos() {
        const [inmuebles] = await db.query(`
      SELECT i.*, p.nombre AS propietario_nombre, t.nombre AS tipo_inmueble 
      FROM inmuebles i
      JOIN personas p ON i.propietario_id = p.id
      JOIN tipoInmueble t ON i.tipoInmueble_id = t.id
    `);
        return inmuebles;
    }

    // Obtener un inmueble por ID
    static async obtenerPorId(id) {
        const [inmuebles] = await db.query(`
      SELECT i.*, p.nombre AS propietario_nombre, t.nombre AS tipo_inmueble 
      FROM inmuebles i
      JOIN personas p ON i.propietario_id = p.id
      JOIN tipoInmueble t ON i.tipoInmueble_id = t.id
      WHERE i.id = ?
    `, [id]);
        return inmuebles[0];
    }

    // Actualizar un inmueble
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE inmuebles SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un inmueble
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM inmuebles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Inmueble;