const db = require('../config/db');

class Inmueble {
    // Crear un inmueble
    static async crear(inmueble) {
        const {
            propietario_id,
            tipoInmueble_id,
            nombre,
            descripcion,
            direccion,
            ubigeo,
            cantidad_pisos = 0,
            cantidad_sotanos = 0,
            estado
        } = inmueble;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insertar inmueble
            const [result] = await connection.query(
                `INSERT INTO inmuebles 
            (propietario_id, tipoInmueble_id, nombre, descripcion, direccion, ubigeo, cantidad_pisos, cantidad_sotanos, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [propietario_id, tipoInmueble_id, nombre, descripcion, direccion, ubigeo, cantidad_pisos, cantidad_sotanos, estado]
            );
            const idinmueble = result.insertId;
            console.log('ID del inmueble creado:', idinmueble);

            // Preparar registros de pisos y sótanos
            const pisosData = [];
            for (let i = 1; i <= cantidad_sotanos; i++) {
                pisosData.push([idinmueble, `Sótano ${i}`, 'sotano']);
            }
            for (let i = 1; i <= cantidad_pisos; i++) {
                pisosData.push([idinmueble, `Piso ${i}`, 'piso']);
            }

            // Bulk insert para eficiencia
            if (pisosData.length) {
                await connection.query(
                    'INSERT INTO pisos (inmueble_id, nombre, tipo) VALUES ?;',
                    [pisosData]
                );
                console.log(`Se crearon ${pisosData.length} pisos/sótanos para inmueble ${idinmueble}`);
            }

            await connection.commit();
            return idinmueble;

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear inmueble y pisos:', error);
            throw error;  // Propaga el error para manejarlo en capas superiores
        } finally {
            connection.release();
        }
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