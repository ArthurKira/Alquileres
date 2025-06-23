const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');
const { upload } = require('../config/s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

// Ruta para subir un archivo a S3
router.post('/subir', verificarToken, upload.single('archivo'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No se recibió ningún archivo');
            return res.status(400).json({ mensaje: 'No se ha proporcionado ningún archivo' });
        }

        console.log('Archivo subido:', req.file);
        console.log('Datos del body:', req.body);

        // Crear registro del documento
        const documentoInfo = {
            nombre: req.file.originalname,
            url: req.file.location,
            key: req.file.key,
            tipo: 'application/pdf',
            documentable_id: req.body.documentable_id,
            documentable_type: req.body.documentable_type
        };

        try {
            const resultado = await documentoController.crearDocumento(documentoInfo);
            console.log('Documento creado exitosamente:', resultado);
            
            return res.status(201).json({
                mensaje: 'Documento subido exitosamente',
                documento: {
                    ...resultado,
                    nombre: documentoInfo.nombre,
                    url: documentoInfo.url,
                    tipo: documentoInfo.tipo
                }
            });
        } catch (dbError) {
            console.error('Error al guardar en la base de datos:', dbError);
            // Intentar eliminar el archivo de S3 si falla el guardado en la BD
            try {
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: req.file.key
                });
                await s3.send(deleteCommand);
                console.log('Archivo eliminado de S3 después del error de BD');
            } catch (s3Error) {
                console.error('Error al eliminar archivo de S3:', s3Error);
            }
            
            return res.status(500).json({
                mensaje: 'Error al guardar la información del documento',
                error: dbError.message
            });
        }
    } catch (error) {
        console.error('Error al procesar la subida:', error);
        return res.status(500).json({
            mensaje: 'Error al subir el documento',
            error: error.message
        });
    }
});

// Rutas protegidas con token
router.post('/', verificarToken, verificarRol(['inquilino', 'administrador']), documentoController.crearDocumentoEndpoint);
router.put('/:id', verificarToken, verificarRol(['administrador']), documentoController.actualizarDocumento);
router.get('/', verificarToken, documentoController.obtenerDocumentos);
router.get('/:id', verificarToken, documentoController.obtenerDocumentoPorId);
router.get('/documentable/:documentable_id/:documentable_type', verificarToken, documentoController.obtenerDocumentosPorDocumentable);
router.delete('/:id', verificarToken, verificarRol(['administrador']), documentoController.eliminarDocumento);

// Rutas públicas para ver y descargar documentos (sin verificación de token)
router.get('/ver/*', documentoController.verDocumento);
router.get('/descargar/*', documentoController.descargarDocumento);

module.exports = router;