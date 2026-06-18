const mongoose = require('mongoose');

// Un material de construcción (cemento, varilla, pintura...).
// No tiene precio propio: el precio vive en ReportePrecio, porque
// un mismo material tiene precios distintos en cada ferretería.
const materialSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  unidadMedida: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
