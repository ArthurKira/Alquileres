const express = require('express');
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/authMiddleware'); // Importa el middleware

const router = express.Router();

// Ruta para registrar una persona y su usuario
router.post('/registrar', authController.registrarPersonaYUsuario);

// Ruta para autenticar (login)
router.post('/login', authController.login);

// Ruta para renovar token
router.post('/renovar-token', authController.renovarToken);

// Ruta para logout
router.post('/logout', authController.logout);

// Ruta protegida (solo para usuarios autenticados)
router.get('/perfil', verificarToken, (req, res) => {
    // req.usuario contiene el payload del token (id y rol)
    res.json({ mensaje: 'Bienvenido a tu perfil', usuario: req.usuario });
});

module.exports = router;