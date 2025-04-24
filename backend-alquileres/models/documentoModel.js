const db = requiere('../config/db');

class Documento {

    //Crear un documento
    static async crear(documento){
        const{ nombre, ruta, documentable_id, documentable_type } = documento;
        const [result] = await db.query(
            'INSERT INTO documentos (nombre, ruta, documentable_id, documentable_type) VALUES (?, ?, ?, ?)',
            [nombre, ruta, documentable_id, documentable_type]
        );
        return result.insertId;
    }

    // Obtener todos los documentos
    static async obtenerTodos() {
        const [documentos] = await db.query('SELECT * FROM documentos');
        return documentos;
    }

    // Obtener un por documentable_id y documentable_type(contrato,pago,gasto)
    static async obtenerPorDocumentable(documentable_id, documentable_type) {
        const [documentos] = await db.query('SELECT * FROM documentos WHERE documentable_id = ? AND documentable_type = ?', [documentable_id, documentable_type]);
        return documentos;
    }

    // Obtener un documento por ID
    static async obtenerPorId(id) {
        const [documentos] = await db.query('SELECT * FROM documentos WHERE id = ?', [id]);
        return documentos[0];
    }

    // Actualizar un documento
    static async actualizar(id, nuevosDatos) {
        const campos = Object.keys(nuevosDatos);
        const valores = Object.values(nuevosDatos);
        const actualizaciones = campos.map(campo => `${campo} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE documentos SET ${actualizaciones} WHERE id = ?`,
            [...valores, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar un documento
    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM documentos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }


}