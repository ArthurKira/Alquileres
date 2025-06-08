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
        const [personas] = await db.query('SELECT * FROM personas WHERE email = ?', [email]);
        if (personas.length > 0) {
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
const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;
const login = async (req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (usuarios.length === 0) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuarioEncontrado = usuarios[0];

        // Verificar bloqueo temporal
        if (usuarioEncontrado.bloqueado_hasta && new Date(usuarioEncontrado.bloqueado_hasta) > new Date()) {
            return res.status(403).json({ mensaje: 'Usuario bloqueado temporalmente. Intente más tarde.' });
        }

        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
        if (!contraseñaValida) {
            // Incrementar intentos fallidos
            const nuevosIntentos = usuarioEncontrado.intentos_fallidos + 1;
            let bloqueadoHasta = null;

            if (nuevosIntentos >= MAX_INTENTOS) {
                bloqueadoHasta = new Date();
                bloqueadoHasta.setMinutes(bloqueadoHasta.getMinutes() + BLOQUEO_MINUTOS);
            }

            await db.query(
                'UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?',
                [nuevosIntentos, bloqueadoHasta, usuarioEncontrado.id]
            );

            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Restablecer intentos fallidos en caso de éxito
        await db.query(
            'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?',
            [usuarioEncontrado.id]
        );

        // Obtener datos de persona para el token
        const [personas] = await db.query('SELECT * FROM personas WHERE id = ?', [usuarioEncontrado.persona_id]);
        if (personas.length === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }

        const persona = personas[0];

        // Generar token JWT
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
            expiresIn: 3600
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

        // Obtener datos de persona
        const [personas] = await db.query('SELECT * FROM personas WHERE id = ?', [usuario.persona_id]);
        if (personas.length === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }

        const persona = personas[0];

        // Generar nuevo token JWT
        const token = jwt.sign(
            { id: persona.id, rol: persona.rol },
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

// Cambiar contraseña
const cambiarContrasena = async (req, res) => {
    const { contraseñaActual, nuevaContraseña } = req.body;
    const personaId = req.usuario.id; // Obtenido del token

    try {
        // Obtener el usuario usando el persona_id
        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE persona_id = ?',
            [personaId]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Verificar la contraseña actual
        const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const nuevaContraseñaHash = await bcrypt.hash(nuevaContraseña, salt);

        // Actualizar la contraseña
        await db.query(
            'UPDATE usuarios SET contraseña = ? WHERE persona_id = ?',
            [nuevaContraseñaHash, personaId]
        );

        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

module.exports = {
    registrarPersonaYUsuario,
    login,
    cambiarContrasena,
    renovarToken,
    logout
};