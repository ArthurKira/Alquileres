const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const Usuario = require('../models/usuarioModel');
const crypto = require('crypto');
require('dotenv').config();

// Registrar una nueva persona y su usuario
const registrarPersonaYUsuario = async (req, res) => {
    const { dni, nombre, apellido, email, telefono, direccion, rol, usuario, contraseña } = req.body;

    try {
        // Verificar si el email ya está registrado
        const [personaExistente] = await db.query('SELECT * FROM personas WHERE email = ?', [email]);
        if (personaExistente.length > 0) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        // Insertar la persona
        const [resultPersona] = await db.query(
            'INSERT INTO personas (dni, nombre, apellido, email, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [dni, nombre, apellido, email, telefono, direccion, rol]
        );

        const personaId = resultPersona.insertId;

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        // Insertar el usuario
        await db.query(
            'INSERT INTO usuarios (persona_id, usuario, contraseña) VALUES (?, ?, ?)',
            [personaId, usuario, contraseñaHash]
        );

        res.status(201).json({ mensaje: 'Persona y usuario registrados correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Autenticar (login)
const login = async (req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        // Verificar si el usuario existe
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (usuarios.length === 0) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuarioEncontrado = usuarios[0];

        // Verificar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Obtener los datos de la persona
        const [personas] = await db.query('SELECT * FROM personas WHERE id = ?', [usuarioEncontrado.persona_id]);
        const persona = personas[0];

        // Generar el token JWT
        const token = jwt.sign(
            { id: persona.id, rol: persona.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generar refresh token
        const refreshToken = crypto.randomBytes(40).toString('hex');
        await Usuario.guardarRefreshToken(usuarioEncontrado.id, refreshToken);

        res.json({ 
            token, 
            refreshToken,
            persona,
            expiresIn: 3600 // 1 hora en segundos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Renovar token
const renovarToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ mensaje: 'Refresh token no proporcionado' });
    }

    try {
        // Verificar el refresh token
        const usuario = await Usuario.verificarRefreshToken(refreshToken);
        
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Refresh token inválido o expirado' });
        }

        // Generar nuevo token JWT
        const token = jwt.sign(
            { id: usuario.persona_id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generar nuevo refresh token
        const newRefreshToken = crypto.randomBytes(40).toString('hex');
        await Usuario.guardarRefreshToken(usuario.id, newRefreshToken);

        res.json({
            token,
            refreshToken: newRefreshToken,
            expiresIn: 3600
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Logout
const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ mensaje: 'Refresh token no proporcionado' });
    }

    try {
        const usuario = await Usuario.verificarRefreshToken(refreshToken);
        if (usuario) {
            await Usuario.eliminarRefreshToken(usuario.id);
        }
        res.json({ mensaje: 'Logout exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

module.exports = {
    registrarPersonaYUsuario,
    login,
    renovarToken,
    logout
};