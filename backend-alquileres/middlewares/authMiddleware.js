const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Añade el payload del token a la solicitud
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
};


module.exports = verificarToken;