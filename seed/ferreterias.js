// Ejecutar: node seed/ferreterias.js
// Inserta ferreterías de ejemplo en la base de datos.
require('dotenv').config();
const mongoose = require('mongoose');
const Ferreteria = require('../src/models/Ferreteria');

const FERRETERIAS = [
  // --- Promart ---
  {
    nombre: 'Promart Homecenter Carapungo',
    direccion: 'Av. Geovanni Calles y Padre Luis Vaccari, Sector Carapungo',
    sector: 'Norte',
    telefono: '0959898000',
    horario: 'Lun–Dom 08:00–21:00',
    descripcion: 'El primer Homecenter del Ecuador. Materiales de construcción, herramientas, acabados y todo para el hogar.',
    ubicacion: { lat: -0.0634, lng: -78.4549 },
  },
  {
    nombre: 'Promart Homecenter Granados',
    direccion: 'Av. Granados y Colimes, frente al Granados Plaza',
    sector: 'Norte',
    telefono: '0959898000',
    horario: 'Lun–Dom 08:00–21:00',
    descripcion: 'El primer Homecenter del Ecuador. Materiales de construcción, herramientas, acabados y todo para el hogar.',
    ubicacion: { lat: -0.1524, lng: -78.4652 },
  },

  // --- Kywi / MegaKywi ---
  {
    nombre: 'Kywi 6 de Diciembre',
    direccion: 'Av. 6 de Diciembre N38-18 y Portete',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.1760, lng: -78.4813 },
  },
  {
    nombre: 'Kywi 10 de Agosto',
    direccion: 'Av. 10 de Agosto N24-59 y Luis Cordero',
    sector: 'Centro',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.2143, lng: -78.5023 },
  },
  {
    nombre: 'Kywi El Bosque',
    direccion: 'Av. El Parque OE71-10, Urb. El Bosque 2da. etapa',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.0856, lng: -78.5448 },
  },
  {
    nombre: 'Kywi La Prensa',
    direccion: 'Av. La Prensa N55-186, frente al CNE',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.0923, lng: -78.5032 },
  },
  {
    nombre: 'Kywi Carcelén',
    direccion: 'Av. Diego de Vásquez y Jaime Roldós',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.0489, lng: -78.5012 },
  },
  {
    nombre: 'Kywi Portal Shopping',
    direccion: 'Av. Simón Bolívar y Panamericana Norte, C.C. Portal Shopping, Calderón',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.0024, lng: -78.4267 },
  },
  {
    nombre: 'Kywi Quitumbe',
    direccion: 'Av. Quitumbe Ñan y Av. Rafael Morán Valverde',
    sector: 'Sur',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.3489, lng: -78.5534 },
  },
  {
    nombre: 'Kywi El Recreo',
    direccion: 'Av. Pedro Vicente Maldonado S11-122, C.C. El Recreo',
    sector: 'Sur',
    telefono: '022655260',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'Ferretería, hogar y construcción. Una de las cadenas líderes del Ecuador.',
    ubicacion: { lat: -0.2987, lng: -78.5478 },
  },
  {
    nombre: 'MegaKywi Granados',
    direccion: 'Av. de los Granados E12-70',
    sector: 'Norte',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'MegaKywi: el formato más grande de Kywi con la mayor variedad en ferretería y construcción.',
    ubicacion: { lat: -0.1567, lng: -78.4634 },
  },
  {
    nombre: 'MegaKywi Los Chillos',
    direccion: 'Av. General Rumiñahui 211 y 7ma. Transversal, Sangolquí',
    sector: 'Valles',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'MegaKywi: el formato más grande de Kywi con la mayor variedad en ferretería y construcción.',
    ubicacion: { lat: -0.3234, lng: -78.4478 },
  },
  {
    nombre: 'MegaKywi Tumbaco',
    direccion: 'Av. 6 de Diciembre E5-67, Tumbaco',
    sector: 'Valles',
    horario: 'Lun–Vie 08:00–18:30, Sáb 08:00–17:00, Dom 09:00–14:00',
    descripcion: 'MegaKywi: el formato más grande de Kywi con la mayor variedad en ferretería y construcción.',
    ubicacion: { lat: -0.2134, lng: -78.3934 },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  // Limpia dueno:null explícito en documentos existentes para que el
  // índice sparse los ignore correctamente (null != sin campo).
  const limpiados = await Ferreteria.updateMany(
    { dueno: null },
    { $unset: { dueno: '' } },
  );
  if (limpiados.modifiedCount > 0) {
    console.log(`  ✓ Limpiados ${limpiados.modifiedCount} docs con dueno:null`);
  }

  let insertadas = 0;
  let actualizadas = 0;

  for (const datos of FERRETERIAS) {
    const { ubicacion, ...resto } = datos;
    const existe = await Ferreteria.findOne({ nombre: datos.nombre });
    if (existe) {
      // Actualiza la ubicación aunque el resto ya exista
      await Ferreteria.updateOne({ _id: existe._id }, { $set: { ubicacion } });
      console.log(`  ↺ Ubicación actualizada: ${datos.nombre}`);
      actualizadas++;
    } else {
      await Ferreteria.create(datos);
      console.log(`  ✓ Insertada: ${datos.nombre}`);
      insertadas++;
    }
  }

  console.log(`\nListo: ${insertadas} insertadas, ${actualizadas} actualizadas con coordenadas.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
