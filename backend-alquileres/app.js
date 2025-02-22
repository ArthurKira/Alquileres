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

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/inmuebles', inmuebleRoutes);
app.use('/api', espacioRoutes);//espacios
app.use('/api/reservas', reservaRoutes);
app.use('/api/tipos-espacio', tipoEspacioRoutes);
app.use('/api/tipos-inmueble', tipoInmuebleRoutes);
app.use('/api/pisos', pisoRoutes); // Nueva línea
app.use('/api/pagos', pagoRoutes); // Nueva línea
app.use('/api/contratos', contratoRoutes); // Nueva línea
app.use('/api/pagos-adicionales', pagoAdicionalRoutes); // Nueva línea
app.use('/api/reportes', reporteRoutes); // Nueva línea
app.use('/api/detalles-reportes', detalleReporteRoutes); // Nueva línea
app.use('/api/gastos', gastoRoutes); // Nueva línea

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend de Alquileres funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});