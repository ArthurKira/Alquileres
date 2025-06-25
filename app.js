const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const personaRoutes=require('./routes/personaRoutes');
const inmuebleRoutes = require('./routes/inmuebleRoutes');
const espacioRoutes = require('./routes/espacioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const tipoEspacioRoutes = require('./routes/tipoEspacioRoutes');
const tipoInmuebleRoutes = require('./routes/tipoInmuebleRoutes');
const pisoRoutes = require('./routes/pisoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const contratoRoutes = require('./routes/contratoRoutes');
const pagoAdicionalRoutes = require('./routes/pagoAdicionalRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const detalleReporteRoutes = require('./routes/detalleReporteRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const documentoRoutes = require('./routes/documentoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');

require('dotenv').config();

const app = express();

// Middlewares
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://rentahab.com', process.env.FRONTEND_URL].filter(Boolean)
        : ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/inmuebles', inmuebleRoutes);
app.use('/api/espacios', espacioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/tipos-espacio', tipoEspacioRoutes);
app.use('/api/tipoInmueble', tipoInmuebleRoutes);
app.use('/api/pisos', pisoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/pagos-adicionales', pagoAdicionalRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/detalles-reportes', detalleReporteRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/documentos', documentoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Backend de Alquileres funcionando',
        puerto: process.env.PORT || 3000,
        entorno: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ 
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Base de datos: ${process.env.DB_HOST || 'localhost'}`);
});
