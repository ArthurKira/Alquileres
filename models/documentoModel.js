const db = require('../config/db');

class Documento {

    //Crear un documento
    static async crear(documentoData) {
        try {
            const [result] = await db.query(
                'INSERT INTO documentos (nombre, url, `key`, tipo, documentable_id, documentable_type) VALUES (?, ?, ?, ?, ?, ?)',
                [documentoData.nombre, documentoData.url, documentoData.key, documentoData.tipo, documentoData.documentable_id, documentoData.documentable_type]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear documento:', error);
            throw error;
        }
    }

    // Obtener todos los documentos
    static async obtenerTodos() {
        const [documentos] = await db.query('SELECT * FROM documentos');
        return documentos;
    }

    // Obtener un por documentable_id y documentable_type(contrato,pago,gasto)
    static async obtenerPorDocumentable(documentable_id, documentable_type) {
        const [documentos] = await db.query(
            'SELECT * FROM documentos WHERE documentable_id = ? AND documentable_type = ?',
            [documentable_id, documentable_type]
        );
        return documentos;
    }


    // Obtener un documento por ID
    static async obtenerPorId(id) {
        const [documentos] = await db.query(
            'SELECT * FROM documentos WHERE id = ?',
            [id]
        );
        return documentos[0];
    }

    // Actualizar un documento
    static async actualizar(id, documentoData) {
        try {
            const [result] = await db.query(
                'UPDATE documentos SET nombre = ?, url = ?, `key` = ?, tipo = ?, documentable_id = ?, documentable_type = ? WHERE id = ?',
                [documentoData.nombre, documentoData.url, documentoData.key, documentoData.tipo, documentoData.documentable_id, documentoData.documentable_type, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar documento:', error);
            throw error;
        }
    }

    // Eliminar un documento
    static async eliminar(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM documentos WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            throw error;
        }
    }

    // Obtener documento por key de S3
    static async obtenerPorKey(key) {
        try {
            console.log('🔍 Buscando documento con key:', key);
            
            const [documentos] = await db.query(
                'SELECT * FROM documentos WHERE `key` = ?',
                [key]
            );

            if (!documentos || documentos.length === 0) {
                console.log('❌ No se encontró documento con key:', key);
                return null;
            }

            console.log('✅ Documento encontrado:', documentos[0]);
            return documentos[0];
        } catch (error) {
            console.error('❌ Error al obtener documento por key:', error);
            throw new Error(`Error al buscar documento: ${error.message}`);
        }
    }

}

module.exports = Documento;