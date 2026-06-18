const Usuario = require('../models/Usuario');
const ReportePrecio = require('../models/ReportePrecio');

// GET /api/usuarios/me (requiere estar logueado)
// Datos del usuario logueado para la pantalla de Perfil: sus puntos,
// desde cuándo está registrado, y cuántos reportes de precio ha hecho.
async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const totalReportes = await ReportePrecio.countDocuments({ usuario: usuario._id });

    return res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      puntos: usuario.puntos,
      fotoUrl: usuario.fotoUrl,
      miembroDesde: usuario.createdAt,
      totalReportes,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el perfil', detalle: error.message });
  }
}

// PUT /api/usuarios/me/foto (requiere estar logueado)
// El cliente ya subió la imagen a /api/uploads/foto y tiene su URL de
// Cloudinary; aquí solo la guardamos como la foto de perfil del usuario.
async function actualizarFotoPerfil(req, res) {
  try {
    const { fotoUrl } = req.body;

    if (!fotoUrl) {
      return res.status(400).json({ message: 'fotoUrl es obligatorio' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuarioId,
      { fotoUrl },
      { new: true } // que devuelva el documento YA actualizado, no el anterior
    );

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({ fotoUrl: usuario.fotoUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la foto de perfil', detalle: error.message });
  }
}

module.exports = { obtenerPerfil, actualizarFotoPerfil };
