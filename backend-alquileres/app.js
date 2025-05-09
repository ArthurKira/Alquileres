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
    origin: 'http://localhost:3001', // Cambia al puerto real de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Documentable-ID', 
        'X-Documentable-Type'
    ],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    maxAge: 86400 // 24 horas en segundos
};
  
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/inmuebles', inmuebleRoutes);
app.use('/api/espacios', espacioRoutes);//espacios
app.use('/api/reservas', reservaRoutes);
app.use('/api/tipos-espacio', tipoEspacioRoutes);
app.use('/api/tipoInmueble', tipoInmuebleRoutes);
app.use('/api/pisos', pisoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/pagos-adicionales', pagoAdicionalRoutes); // Nueva línea
app.use('/api/reportes', reporteRoutes); // Nueva línea
app.use('/api/detalles-reportes', detalleReporteRoutes); // Nueva línea
app.use('/api/gastos', gastoRoutes); // Nueva línea
app.use('/api/documentos', documentoRoutes); // Nueva línea
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend de Alquileres funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
