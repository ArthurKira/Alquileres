const db = require('../config/db');

class Persona {
    // Crear una persona
    static async crear(persona) {
        const { dni, nombre, apellido, email, telefono, direccion, rol } = persona;
        const [result] = await db.query(
            'INSERT INTO personas (dni, nombre, apellido, email, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [dni, nombre, apellido, email, telefono, direccion, rol]
        );
        return result.insertId;
    }

    // Obtener todas las personas
    static async obtenerTodos() {
        const [personas] = await db.query('SELECT * FROM personas');
        return personas;
    }

    // Obtener todas las personas que son inquilinos
    static async obtenerInquilinos() {
        const [personas] = await db.query('SELECT * FROM personas WHERE rol = "inquilino"');
        return personas;
    }

    // obtener persona por documento
    static async obtenerPorDocumento(dni) {
        const [personas] = await db.query('SELECT * FROM personas WHERE dni = ?', [dni]);
        return personas[0];
    }

    // Obtener una persona por ID
    static async obtenerPorId(id) {
        const [personas] = await db.query('SELECT * FROM personas WHERE id = ?', [id]);
        return personas[0];
    }

    // Obtener una persona por email
    static async obtenerPorEmail(email) {
        const [personas] = await db.query('SELECT * FROM personas WHERE email = ?', [email]);
        return personas[0];
    }

    // Actualizar una persona
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE personas SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar una persona
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM personas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Persona;
