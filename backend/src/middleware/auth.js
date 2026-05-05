const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Leer el token que viene en el encabezado (header) de la petición
    const authHeader = req.header('Authorization');

    // 2. Si no hay token, no lo dejamos pasar
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
    }

    try {
        // El token suele venir como "Bearer TOKEN_AQUÍ", así que lo separamos
        const token = authHeader.split(' ')[1];
        
        // 3. Verificar si el token es válido usando la palabra secreta de tu .env
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Guardar los datos del usuario en la petición para que el controlador los use
        req.user = cifrado;
        
        // 5. ¡Todo bien! Pasar al siguiente paso (el controlador)
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido o expirado.' });
    }
};

