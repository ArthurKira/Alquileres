const db = require('../config/db');
const crypto = require('crypto');

class Usuario {
    // ... existing code ...

    // Guardar refresh token
    static async guardarRefreshToken(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // El refresh token expira en 7 días

        await db.query(
            'UPDATE usuarios SET refresh_token = ?, refresh_token_expires = ? WHERE id = ?',
            [refreshToken, expiresAt, userId]
        );
    }

    // Verificar refresh token
    static async verificarRefreshToken(refreshToken) {
        const [usuarios] = await db.query(
            'SELECT u.*, p.rol FROM usuarios u JOIN personas p ON u.persona_id = p.id WHERE u.refresh_token = ? AND u.refresh_token_expires > NOW()',
            [refreshToken]
        );
        return usuarios[0];
    }

    // Eliminar refresh token (logout)
    static async eliminarRefreshToken(userId) {
        await db.query(
            'UPDATE usuarios SET refresh_token = NULL, refresh_token_expires = NULL WHERE id = ?',
            [userId]
        );
    }
}

module.exports = Usuario; 