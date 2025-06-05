const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

// Configurar multer para procesar primero el body antes de la configuración de destino
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        console.log('Iniciando proceso de configuración de destino');
        console.log('Datos del body (destination):', req.body);
        console.log('Headers:', req.headers);
        
        // Obtener información del body directamente
        let documentable_type = req.body.documentable_type || '';
        let documentable_id = req.body.documentable_id || '';
        
        console.log('Valores leídos del body:');
        console.log('- documentable_type:', documentable_type);
        console.log('- documentable_id:', documentable_id);
        
        // Usar valores por defecto solo si no hay datos
        if (!documentable_type || !documentable_id) {
          console.warn('⚠️ Usando valores temporales por defecto para evitar error');
          documentable_type = documentable_type || 'pago';
          documentable_id = documentable_id || '1';
        }

        // Construir la ruta de destino
        const dir = path.join(__dirname, '..', 'public', 'documentos', documentable_type, documentable_id.toString());
        console.log('Directorio de destino:', dir);
        
        // Verificar si el directorio existe
        try {
          const exists = await fs.pathExists(dir);
          console.log(`El directorio ${exists ? 'existe' : 'no existe'}`);
          
          if (!exists) {
            console.log('Creando directorio...');
            await fs.ensureDir(dir);
            console.log('Directorio creado exitosamente');
          }
        } catch (fsError) {
          console.error('Error al verificar/crear directorio:', fsError);
          // Crear directorio alternativo para evitar errores
          const tempDir = path.join(__dirname, '..', 'public', 'documentos', 'temp');
          await fs.ensureDir(tempDir);
          console.log('Usando directorio temporal alternativo:', tempDir);
          return cb(null, tempDir);
        }
        
        cb(null, dir);
      } catch (error) {
        console.error('Error general al configurar el destino:', error);
        // Crear directorio alternativo para evitar errores
        try {
          const tempDir = path.join(__dirname, '..', 'public', 'documentos', 'temp');
          await fs.ensureDir(tempDir);
          console.log('Usando directorio temporal alternativo en caso de error:', tempDir);
          cb(null, tempDir);
        } catch (finalError) {
          cb(error);
        }
      }
    },
    filename: (req, file, cb) => {
      try {
        console.log('Generando nombre de archivo para:', file.originalname);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const uniqueName = `${nameWithoutExt}-${Date.now()}${ext}`;
        console.log('Nombre generado:', uniqueName);
        cb(null, uniqueName);
      } catch (error) {
        console.error('Error al generar el nombre del archivo:', error);
        cb(error);
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    // Aceptar solo archivos PDF
    console.log('Verificando tipo de archivo:', file.mimetype);
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      console.error('Tipo de archivo no permitido:', file.mimetype);
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const subirArchivo = (req, res) => {
  try {
    console.log('Procesando archivo subido');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.error('No se recibió ningún archivo');
      return res.status(400).json({ 
        mensaje: 'No se subió ningún archivo',
        error: 'No se recibió ningún archivo en la petición'
      });
    }
    
    console.log('Archivo recibido:', req.file);
    
    // Extraer la ruta relativa
    let rutaRelativa = '';
    try {
      rutaRelativa = req.file.path.replace(/\\/g, '/').split('public/')[1];
    } catch (pathError) {
      console.error('Error al procesar la ruta del archivo:', pathError);
      rutaRelativa = `documentos/temp/${req.file.filename}`;
    }
    
    console.log('Ruta relativa del archivo:', rutaRelativa);

    res.status(200).json({
      mensaje: 'Archivo subido correctamente',
      nombre: req.file.filename,
      ruta: rutaRelativa
    });
  } catch (error) {
    console.error('Error en subirArchivo:', error);
    res.status(500).json({ 
      mensaje: 'Error al procesar el archivo',
      error: error.message 
    });
  }
};

module.exports = {
  upload,
  subirArchivo
}; 