const Documento = require('../models/documentoModel');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../config/s3');

// crear un documento
const crearDocumento = async (documentoData) => {
    try {
        console.log('📥 Datos recibidos para crear documento:', documentoData);
        
        if (!documentoData.documentable_id || !documentoData.documentable_type) {
            throw new Error('documentable_id y documentable_type son requeridos');
        }

        const idDocumento = await Documento.crear(documentoData);
        return { id: idDocumento, mensaje: 'Documento creado exitosamente' };
    } catch (error) {
        console.error('❌ Error al crear el documento:', error);
        throw error;
    }
};

// Endpoint para crear documento (para API REST)
const crearDocumentoEndpoint = async (req, res) => {
    try {
        const resultado = await crearDocumento(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en endpoint de crear documento:', error);
        res.status(500).json({ mensaje: 'Error al crear el documento', error: error.message });
    }
};

// Actualizar un documento
const actualizarDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Documento.actualizar(id, req.body);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }
        res.json({ mensaje: 'Documento actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el documento', error: error.message });
    }
};

// Obtener todos los documentos
const obtenerDocumentos = async (req, res) => {
    try {
        const documentos = await Documento.obtenerTodos();
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los documentos', error: error.message });
    }
};

// Obtener un documento por ID
const obtenerDocumentoPorId = async (req, res) => {
    try {
        const documento = await Documento.obtenerPorId(req.params.id);
        if (!documento) {
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }
        res.json(documento);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el documento', error: error.message });
    }
};

// Obtener documentos por documentable_id y documentable_type
const obtenerDocumentosPorDocumentable = async (req, res) => {
    try {
        const { documentable_id, documentable_type } = req.params;
        const documentos = await Documento.obtenerPorDocumentable(documentable_id, documentable_type);
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los documentos', error: error.message });
    }
};

// Eliminar un documento
const eliminarDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const documento = await Documento.obtenerPorId(id);
        
        if (!documento) {
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }

        // Eliminar de S3
        try {
            await s3.deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: documento.key
            });
        } catch (s3Error) {
            console.error('Error al eliminar de S3:', s3Error);
        }

        // Eliminar de la base de datos
        await Documento.eliminar(id);
        res.json({ mensaje: 'Documento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el documento', error: error.message });
    }
};

// Ver documento (genera URL firmada para ver)
const verDocumento = async (req, res) => {
    try {
        let key = req.params[0]; // Usar el comodín de la ruta
        console.log('🔍 Intentando ver documento con key original:', key);

        // Verificar que la key no esté vacía
        if (!key) {
            console.error('❌ Key no proporcionada');
            return res.status(400).json({ mensaje: 'Key del documento no proporcionada' });
        }

        // Si la key no comienza con 'documentos/', agregarla
        if (!key.startsWith('documentos/')) {
            key = `documentos/${key}`;
            console.log('🔄 Key modificada con prefijo:', key);
        }

        // Buscar el documento en la base de datos
        const documento = await Documento.obtenerPorKey(key);
        
        if (!documento) {
            console.error('❌ Documento no encontrado en BD para key:', key);
            return res.status(404).json({ mensaje: 'Documento no encontrado en la base de datos' });
        }

        console.log('📄 Documento encontrado:', documento);

        // Generar comando para S3
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: documento.key,
            ResponseContentType: 'application/pdf'
        });

        // Generar URL firmada
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL válida por 1 hora
        console.log('🔗 URL firmada generada');

        res.json({ 
            url,
            nombre: documento.nombre,
            tipo: documento.tipo
        });
    } catch (error) {
        console.error('❌ Error al generar URL de visualización:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener URL del documento',
            error: error.message 
        });
    }
};

// Descargar documento (genera URL firmada para descarga)
const descargarDocumento = async (req, res) => {
    try {
        let key = req.params[0]; // Usar el comodín de la ruta
        console.log('🔍 Intentando descargar documento con key original:', key);

        // Verificar que la key no esté vacía
        if (!key) {
            console.error('❌ Key no proporcionada');
            return res.status(400).json({ mensaje: 'Key del documento no proporcionada' });
        }

        // Si la key no comienza con 'documentos/', agregarla
        if (!key.startsWith('documentos/')) {
            key = `documentos/${key}`;
            console.log('🔄 Key modificada con prefijo:', key);
        }

        // Buscar el documento en la base de datos
        const documento = await Documento.obtenerPorKey(key);
        
        if (!documento) {
            console.error('❌ Documento no encontrado en BD para key:', key);
            return res.status(404).json({ mensaje: 'Documento no encontrado en la base de datos' });
        }

        console.log('📄 Documento encontrado:', documento);

        // Generar comando para S3
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: documento.key,
            ResponseContentType: 'application/pdf',
            ResponseContentDisposition: `attachment; filename="${documento.nombre}"`
        });

        // Generar URL firmada
        const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // URL válida por 5 minutos
        console.log('🔗 URL firmada generada para descarga');

        res.json({ 
            url,
            nombre: documento.nombre,
            tipo: documento.tipo
        });
    } catch (error) {
        console.error('❌ Error al generar URL de descarga:', error);
        res.status(500).json({ 
            mensaje: 'Error al generar URL de descarga',
            error: error.message 
        });
    }
};

module.exports = {
    crearDocumento,
    crearDocumentoEndpoint,
    actualizarDocumento,
    obtenerDocumentos,
    obtenerDocumentoPorId,
    obtenerDocumentosPorDocumentable,
    eliminarDocumento,
    verDocumento,
    descargarDocumento
};
