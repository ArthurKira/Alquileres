const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verificarToken = (req, res, next) => {
  // Por ahora, permitiremos todas las solicitudes sin verificación de token
  // para que el sistema funcione mientras se implementa la autenticación completa
  next();
  
  /* Implementación completa de verificación de token (comentada por ahora)
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({
      mensaje: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido'
    });
  }
  */
};

const verificarRol = (roles) => {
  return (req, res, next) => {
    // Por ahora, permitiremos todas las solicitudes sin verificación de rol
    // para que el sistema funcione mientras se implementa la autenticación completa
    next();
    
    /* Implementación completa de verificación de rol (comentada por ahora)
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'Usuario no autenticado'
      });
    }

    if (roles.includes(req.usuario.rol)) {
      next();
    } else {
      res.status(403).json({
        mensaje: 'No tiene permisos para realizar esta acción'
      });
    }
    */
  };
};

module.exports = {
  verificarToken,
  verificarRol
}; 