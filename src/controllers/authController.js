const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Genera el token JWT que el usuario va a usar en cada petición
// futura para demostrar que está logueado.
function generarToken(usuarioId) {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Da forma a la respuesta de usuario, sin exponer nunca el passwordHash.
function formatearUsuario(usuario) {
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    puntos: usuario.puntos,
    fotoUrl: usuario.fotoUrl,
  };
}

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' });
    }

    const existente = await Usuario.findOne({ email: email.toLowerCase() });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe una cuenta con ese correo' });
    }

    // 10 = "salt rounds": qué tan costoso (lento) es calcular el hash.
    // Más alto = más seguro pero más lento. 10 es el estándar recomendado.
    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({ nombre, email, passwordHash });

    const token = generarToken(usuario._id);
    return res.status(201).json({ token, usuario: formatearUsuario(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la cuenta', detalle: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    // Mensaje genérico a propósito: no decimos "el correo no existe" para
    // no darle pistas a alguien que intenta adivinar cuentas válidas.
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, usuario.passwordHash);
    if (!coincide) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario._id);
    return res.status(200).json({ token, usuario: formatearUsuario(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión', detalle: error.message });
  }
}

module.exports = { register, login };
