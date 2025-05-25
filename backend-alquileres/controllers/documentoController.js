const Documento = require('../models/documentoModel');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

// crear un documento
const crearDocumento = async (req, res) => {
    try {
        console.log('📥 Datos recibidos en req.body:', req.body);
        const nuevoDocumento = req.body;
        const idDocumento = await Documento.crear(nuevoDocumento);
        res.status(201).json({ mensaje: 'Documento creado exitosamente', id: idDocumento });
    } catch (error) {
        console.error('❌ Error al crear el documento:', error);
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


// Ver documento
const verDocumento = async (req, res) => {
    try {
        // La ruta del archivo estará en req.params[0] debido al comodín *
        const rutaRelativa = req.params[0];
        console.log('Ruta relativa recibida:', rutaRelativa);
        
        // Construir la ruta absoluta al documento
        const rutaAbsoluta = path.join(process.cwd(), 'public', rutaRelativa);
        console.log('Ruta absoluta construida:', rutaAbsoluta);
        
        // Verificar si el archivo existe
        try {
            await fs.access(rutaAbsoluta);
            console.log('Archivo encontrado en:', rutaAbsoluta);
            // Configurar headers para PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            // Enviar el archivo
            res.sendFile(rutaAbsoluta);
        } catch (error) {
            console.error('Error al acceder al archivo:', error);
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }
    } catch (error) {
        console.error('Error al ver el documento:', error);
        res.status(500).json({ mensaje: 'Error al ver el documento', error: error.message });
    }
};

// Descargar documento
const descargarDocumento = async (req, res) => {
    try {
        // La ruta del archivo estará en req.params[0] debido al comodín *
        const rutaRelativa = req.params[0];
        console.log('Ruta relativa recibida para descarga:', rutaRelativa);
        
        // Construir la ruta absoluta al documento
        const rutaAbsoluta = path.join(process.cwd(), 'public', rutaRelativa);
        console.log('Ruta absoluta construida para descarga:', rutaAbsoluta);
        
        // Verificar si el archivo existe
        try {
            await fs.access(rutaAbsoluta);
            console.log('Archivo encontrado para descarga:', rutaAbsoluta);
            
            // Obtener el nombre original del archivo
            const nombreArchivo = path.basename(rutaRelativa);
            
            // Configurar headers para descarga
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
            
            // Enviar el archivo como descarga
            res.download(rutaAbsoluta, nombreArchivo, (err) => {
                if (err) {
                    console.error('Error durante la descarga:', err);
                    res.status(500).json({ mensaje: 'Error al descargar el archivo' });
                }
            });
        } catch (error) {
            console.error('Error al acceder al archivo para descarga:', error);
            return res.status(404).json({ mensaje: 'Documento no encontrado' });
        }
    } catch (error) {
        console.error('Error al descargar el documento:', error);
        res.status(500).json({ mensaje: 'Error al descargar el documento', error: error.message });
    }
};

module.exports = {
    crearDocumento,
    actualizarDocumento,
    obtenerDocumentos,
    obtenerDocumentoPorId,
    obtenerDocumentosPorDocumentable,
    eliminarDocumento,
    verDocumento,
    descargarDocumento
}
