const Documento = require('../models/documentoModel');

// crear un documento
const crearDocumento = async (req, res) => {
    try {
        const nuevoDocumento = req.body;
        const idDocumento = await Documento.crear(nuevoDocumento);
        res.status(201).json({ mensaje: 'Documento creado exitosamente', id: idDocumento });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el documento', error: error.message });
    }
};

//Actualizar un documento
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

//Obtener todos los documentos
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

// Obtener un por documentable_id y documentable_type(contrato,pago,gasto)
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
        const eliminado = await Documento.eliminar(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }
        res.json({ mensaje: 'Documento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el documento', error: error.message });
    }
};

module.exports = {
    crearDocumento,
    actualizarDocumento,
    obtenerDocumentos,
    obtenerDocumentoPorId,
    obtenerDocumentosPorDocumentable,
    eliminarDocumento
}
