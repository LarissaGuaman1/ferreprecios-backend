const mongoose = require('mongoose');
const SECTORES = require('../utils/sectores');

const ferreteriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  // "enum" rechaza cualquier valor que no esté en la lista SECTORES,
  // así evitamos que se guarde un sector mal escrito.
  sector: { type: String, required: true, enum: SECTORES },
  telefono: { type: String },
  // Coordenadas para el mapa (funcionalidad 7). Opcional por ahora:
  // muchas ferreterías se van a registrar sin coordenadas al inicio.
  ubicacion: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Ferreteria', ferreteriaSchema);
