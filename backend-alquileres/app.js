const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const inmuebleRoutes = require('./routes/inmuebleRoutes');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/inmuebles', inmuebleRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend de Alquileres funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});