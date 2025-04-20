const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
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

        res.json({ token, persona });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

module.exports = {
    registrarPersonaYUsuario,
    login,
};