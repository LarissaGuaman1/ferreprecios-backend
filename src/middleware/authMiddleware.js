const jwt = require('jsonwebtoken');

// Express ejecuta esto ANTES de la función de la ruta, si lo agregamos
// como segundo argumento en router.post('/ruta', authMiddleware, controlador).
function authMiddleware(req, res, next) {
  // El header llega como "Authorization: Bearer eyJhbGc...". Separamos
  // por espacio y nos quedamos con la segunda parte.
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    // jwt.verify revisa que el token sea válido Y que no haya expirado,
    // usando el mismo JWT_SECRET con el que se firmó en authController.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos el id del usuario en el request, para que el siguiente
    // controlador (uploadController, y luego reporteController) sepa
    // quién está haciendo la petición sin tener que volver a verificar nada.
    req.usuarioId = payload.id;
    next(); // continúa hacia el controlador de la ruta
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
