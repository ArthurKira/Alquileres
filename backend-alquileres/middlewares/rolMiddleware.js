const verificarRol = (rolesPermitidos) => (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
};


module.exports = verificarRol;