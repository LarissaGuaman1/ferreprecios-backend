const mongoose = require('mongoose');

// Relaciona Material + Ferreteria + Usuario y guarda el precio que
// el usuario reportó. Es el dato central del crowdsourcing.
const reportePrecioSchema = new mongoose.Schema({
  // "ref: 'Material'" le dice a Mongoose a qué modelo apunta este ID.
  // Eso permite usar .populate('material') después para traer el
  // documento completo del material en vez de solo su ID.
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  ferreteria: { type: mongoose.Schema.Types.ObjectId, ref: 'Ferreteria', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

  precio: { type: Number, required: true },

  // Marca del producto (ej: Holcim, Adelca, Pinturas Unidas).
  // Ayuda al comprador a saber exactamente qué producto se está cotizando.
  marca: { type: String },

  // Especificaciones adicionales del producto separadas por guión
  // (ej: "Resistencia 350 PSI - 50 kg - Tipo Portland").
  caracteristicas: { type: String },

  // Se llena cuando conectemos Cloudinary (funcionalidad de reporte).
  // Por ahora puede quedar vacío en los datos de ejemplo.
  fotoUrl: { type: String },

  // Cuántas veces otro usuario confirmó que este precio sigue vigente.
  // Lo usamos junto con la fecha (createdAt, automática por timestamps)
  // para calcular el estado de confiabilidad sin guardarlo como campo fijo.
  confirmaciones: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ReportePrecio', reportePrecioSchema);
