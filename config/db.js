const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'alquileres',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
    queueLimit: 0,
    // Configuraciones para conexiones remotas en producción
    acquireTimeout: 120000,       // 2 minutos para Render
    keepAliveInitialDelay: 0,     // Mantener conexión viva
    enableKeepAlive: true,        // Habilitar keep-alive
    multipleStatements: false,    // Seguridad: deshabilitar múltiples statements
    ssl: process.env.NODE_ENV === 'production' && process.env.DB_SSL === 'true' 
        ? { rejectUnauthorized: false } : false,
    // Configuración específica para hosting
    charset: 'utf8mb4',
    timezone: 'Z'
});

// Event listeners para monitorear la conexión
pool.on('connection', function (connection) {
    console.log('Nueva conexión a la BD establecida', connection.threadId);
});

pool.on('error', function(err) {
    console.error('Error en el pool de conexiones de la BD:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Conexión con la BD perdida, reintentando...');
    }
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const [rows] = await pool.promise().query('SELECT 1 as test');
        console.log('✅ Conexión a la base de datos exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        return false;
    }
};

// Probar conexión al inicializar
testConnection();

module.exports = pool.promise();