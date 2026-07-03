const mongoose = require('mongoose');

// El Schema define la forma que tiene un documento "usuario" en MongoDB:
// qué campos tiene, de qué tipo son, y cuáles son obligatorios.
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // MongoDB rechaza si ya existe un usuario con ese email
    lowercase: true,
  },
  // Nunca se guarda la contraseña en texto plano, solo su hash
  // (generado con bcrypt en el controller antes de guardar).
  passwordHash: {
    type: String,
    required: true,
  },
  // Puntos del sistema de reputación (funcionalidad 6 del MVP).
  puntos: {
    type: Number,
    default: 0,
  },
  // URL de Cloudinary de la foto de perfil. null = todavía no subió ninguna.
  fotoUrl: {
    type: String,
    default: null,
  },
  // 'comprador' = usuario normal que reporta precios.
  // 'ferreteria' = dueño de ferretería que gestiona su tienda.
  rol: {
    type: String,
    enum: ['comprador', 'ferreteria'],
    default: 'comprador',
  },
}, {
  timestamps: true, // agrega createdAt y updatedAt automáticamente
});

// mongoose.model crea la clase que usamos para leer/escribir en la
// colección "usuarios" (Mongoose la pluraliza automáticamente).
module.exports = mongoose.model('Usuario', usuarioSchema);
