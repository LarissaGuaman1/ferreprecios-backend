const mongoose = require('mongoose');
const SECTORES = require('../utils/sectores');

const ferreteriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  // "enum" rechaza cualquier valor que no esté en la lista SECTORES,
  // así evitamos que se guarde un sector mal escrito.
  sector: { type: String, required: true, enum: SECTORES },
  telefono: { type: String },
  horario: { type: String },
  descripcion: { type: String },
  fotoUrl: { type: String, default: null },
  // Coordenadas para el mapa (funcionalidad 7). Opcional por ahora:
  // muchas ferreterías se van a registrar sin coordenadas al inicio.
  ubicacion: {
    lat: { type: Number },
    lng: { type: Number },
  },
  // Usuario con rol='ferreteria' que administra esta tienda.
  // sparse:true permite que haya muchas ferreterías sin dueño (creadas por compradores)
  // pero solo una por dueño (unique sobre los que sí tienen dueño).
  dueno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    unique: true,
    sparse: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Ferreteria', ferreteriaSchema);
