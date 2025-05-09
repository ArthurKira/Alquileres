const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const uploadController = require('../controllers/uploadController');  // Importamos el controlador de subida de archivos
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');


// Crear un nuevo documento
router.post('/', verificarToken, verificarRol(['inquilino', 'administrador']), documentoController.crearDocumento);

// Actualizar un documento
router.put('/:id', verificarToken, verificarRol(['administrador']), documentoController.actualizarDocumento);

// Obtener todos los documentos
router.get('/', verificarToken, documentoController.obtenerDocumentos);

// Obtener un documento por ID
router.get('/:id', verificarToken, documentoController.obtenerDocumentoPorId);

// Obtener documentos por documentable_id y documentable_type (contrato, pago, gasto)
router.get('/documentable/:documentable_id/:documentable_type', verificarToken, documentoController.obtenerDocumentosPorDocumentable);

// Eliminar un documento
router.delete('/:id', verificarToken, verificarRol(['administrador']), documentoController.eliminarDocumento);

// Ruta para subir un archivo (nuevo endpoint)
router.post('/upload', verificarToken, uploadController.upload.single('archivo'), uploadController.subirArchivo);

module.exports = router;
