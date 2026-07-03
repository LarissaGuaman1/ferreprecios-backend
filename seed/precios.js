// Ejecutar: node seed/precios.js
// Inserta materiales y reportes de precios de ejemplo.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../src/models/Usuario');
const Material = require('../src/models/Material');
const Ferreteria = require('../src/models/Ferreteria');
const ReportePrecio = require('../src/models/ReportePrecio');

// ─── Catálogo de materiales ────────────────────────────────────────────────
const MATERIALES = [
  { nombre: 'Cemento Portland tipo I', categoria: 'Cementos', unidadMedida: 'saco 50 kg' },
  { nombre: 'Bloque pesado 15×20×40 cm', categoria: 'Bloques y ladrillos', unidadMedida: 'unidad' },
  { nombre: 'Bloque pesado 10×20×40 cm', categoria: 'Bloques y ladrillos', unidadMedida: 'unidad' },
  { nombre: 'Varilla corrugada 8 mm × 12 m', categoria: 'Hierro y acero', unidadMedida: 'unidad' },
  { nombre: 'Varilla corrugada 10 mm × 12 m', categoria: 'Hierro y acero', unidadMedida: 'unidad' },
  { nombre: 'Varilla corrugada 12 mm × 12 m', categoria: 'Hierro y acero', unidadMedida: 'unidad' },
  { nombre: 'Pintura de caucho interior', categoria: 'Pinturas y acabados', unidadMedida: 'galón' },
  { nombre: 'Pintura esmalte', categoria: 'Pinturas y acabados', unidadMedida: 'galón' },
  { nombre: 'Placa de yeso estándar 1.22×2.44 m', categoria: 'Drywall', unidadMedida: 'unidad' },
  { nombre: 'Impermeabilizante líquido', categoria: 'Impermeabilizantes', unidadMedida: 'galón' },
  { nombre: 'Tubo PVC desagüe 110 mm × 3 m', categoria: 'Tuberías y sanitarios', unidadMedida: 'unidad' },
  { nombre: 'Arena lavada de río', categoria: 'Áridos', unidadMedida: 'm³' },
];

// ─── Precios por ferretería ────────────────────────────────────────────────
// Cada entrada: [nombreFerreteria, nombreMaterial, precio, marca, caracteristicas?]
const PRECIOS = [
  // Cemento Portland tipo I
  ['Promart Homecenter Carapungo', 'Cemento Portland tipo I', 8.50, 'Holcim', 'Resistencia 350 PSI, tipo Portland GU'],
  ['Promart Homecenter Granados',  'Cemento Portland tipo I', 8.50, 'Holcim', 'Resistencia 350 PSI, tipo Portland GU'],
  ['Kywi El Bosque',              'Cemento Portland tipo I', 7.69, 'Campeón', 'Cemento hidráulico, saco 50 kg'],
  ['Kywi La Prensa',              'Cemento Portland tipo I', 8.63, 'Selva Alegre', 'Tipo Portland GU, saco 50 kg'],
  ['Kywi Carcelén',               'Cemento Portland tipo I', 8.63, 'Selva Alegre', 'Tipo Portland GU, saco 50 kg'],
  ['Kywi 10 de Agosto',           'Cemento Portland tipo I', 7.69, 'Campeón', 'Cemento hidráulico, saco 50 kg'],
  ['Kywi El Recreo',              'Cemento Portland tipo I', 8.63, 'Selva Alegre', 'Tipo Portland GU, saco 50 kg'],
  ['Kywi Quitumbe',               'Cemento Portland tipo I', 7.69, 'Campeón', 'Cemento hidráulico, saco 50 kg'],
  ['MegaKywi Granados',           'Cemento Portland tipo I', 8.50, 'Holcim', 'Resistencia 350 PSI, tipo Portland GU'],
  ['MegaKywi Los Chillos',        'Cemento Portland tipo I', 8.50, 'Holcim', 'Resistencia 350 PSI, tipo Portland GU'],
  ['MegaKywi Tumbaco',            'Cemento Portland tipo I', 8.63, 'Selva Alegre', 'Tipo Portland GU, saco 50 kg'],

  // Bloque pesado 15×20×40
  ['Promart Homecenter Carapungo', 'Bloque pesado 15×20×40 cm', 1.38, 'Bloqcrete', 'Bloque vibrado alta resistencia'],
  ['Kywi El Bosque',              'Bloque pesado 15×20×40 cm', 1.35, 'Bloquera del Norte', 'Bloque de hormigón vibrado'],
  ['Kywi La Prensa',              'Bloque pesado 15×20×40 cm', 1.35, 'Bloquera del Norte', 'Bloque de hormigón vibrado'],
  ['Kywi 10 de Agosto',           'Bloque pesado 15×20×40 cm', 1.32, 'Bloquera del Norte', 'Bloque de hormigón vibrado'],
  ['Kywi El Recreo',              'Bloque pesado 15×20×40 cm', 1.32, 'Bloquera del Sur', 'Bloque de hormigón vibrado'],
  ['MegaKywi Granados',           'Bloque pesado 15×20×40 cm', 1.38, 'Bloqcrete', 'Bloque vibrado alta resistencia'],
  ['MegaKywi Los Chillos',        'Bloque pesado 15×20×40 cm', 1.35, 'Bloquera del Norte', 'Bloque de hormigón vibrado'],

  // Bloque pesado 10×20×40
  ['Promart Homecenter Carapungo', 'Bloque pesado 10×20×40 cm', 1.29, 'Bloqcrete', 'Bloque vibrado alta resistencia'],
  ['Kywi El Bosque',              'Bloque pesado 10×20×40 cm', 1.27, 'Bloquera del Norte', 'Bloque de hormigón vibrado'],
  ['Kywi El Recreo',              'Bloque pesado 10×20×40 cm', 1.25, 'Bloquera del Sur', 'Bloque de hormigón vibrado'],
  ['MegaKywi Granados',           'Bloque pesado 10×20×40 cm', 1.29, 'Bloqcrete', 'Bloque vibrado alta resistencia'],

  // Varilla 8mm
  ['Promart Homecenter Carapungo', 'Varilla corrugada 8 mm × 12 m', 3.95, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Promart Homecenter Granados',  'Varilla corrugada 8 mm × 12 m', 3.95, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi Carcelén',               'Varilla corrugada 8 mm × 12 m', 3.85, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi 10 de Agosto',           'Varilla corrugada 8 mm × 12 m', 3.85, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi El Recreo',              'Varilla corrugada 8 mm × 12 m', 3.90, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],
  ['MegaKywi Granados',           'Varilla corrugada 8 mm × 12 m', 3.95, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['MegaKywi Los Chillos',        'Varilla corrugada 8 mm × 12 m', 3.90, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],
  ['MegaKywi Tumbaco',            'Varilla corrugada 8 mm × 12 m', 3.90, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],

  // Varilla 10mm
  ['Promart Homecenter Carapungo', 'Varilla corrugada 10 mm × 12 m', 5.90, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Promart Homecenter Granados',  'Varilla corrugada 10 mm × 12 m', 5.90, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi Carcelén',               'Varilla corrugada 10 mm × 12 m', 5.80, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi El Recreo',              'Varilla corrugada 10 mm × 12 m', 5.85, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],
  ['MegaKywi Granados',           'Varilla corrugada 10 mm × 12 m', 5.90, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['MegaKywi Los Chillos',        'Varilla corrugada 10 mm × 12 m', 5.85, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],

  // Varilla 12mm
  ['Promart Homecenter Carapungo', 'Varilla corrugada 12 mm × 12 m', 8.45, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi Carcelén',               'Varilla corrugada 12 mm × 12 m', 8.30, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['Kywi El Recreo',              'Varilla corrugada 12 mm × 12 m', 8.40, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],
  ['MegaKywi Granados',           'Varilla corrugada 12 mm × 12 m', 8.45, 'Adelca', 'Acero de refuerzo ASTM A615 Gr60'],
  ['MegaKywi Los Chillos',        'Varilla corrugada 12 mm × 12 m', 8.40, 'Ipac', 'Acero corrugado Gr60, norma NTE INEN'],

  // Pintura de caucho interior
  ['Promart Homecenter Carapungo', 'Pintura de caucho interior', 14.90, 'Pinturas Cóndor', 'Látex acrílico lavable, rendimiento 30-35 m²/galón'],
  ['Promart Homecenter Granados',  'Pintura de caucho interior', 14.90, 'Pinturas Cóndor', 'Látex acrílico lavable, rendimiento 30-35 m²/galón'],
  ['Kywi La Prensa',              'Pintura de caucho interior', 13.90, 'Pinturas Unidas', 'Látex interior, cobertura 35 m²/galón'],
  ['Kywi El Bosque',              'Pintura de caucho interior', 13.90, 'Pinturas Unidas', 'Látex interior, cobertura 35 m²/galón'],
  ['Kywi El Recreo',              'Pintura de caucho interior', 13.90, 'Pinturas Unidas', 'Látex interior, cobertura 35 m²/galón'],
  ['Kywi Quitumbe',               'Pintura de caucho interior', 14.50, 'Pinturas Cóndor', 'Látex acrílico lavable, rendimiento 30-35 m²/galón'],
  ['MegaKywi Granados',           'Pintura de caucho interior', 14.90, 'Pinturas Cóndor', 'Látex acrílico lavable, rendimiento 30-35 m²/galón'],
  ['MegaKywi Los Chillos',        'Pintura de caucho interior', 13.90, 'Pinturas Unidas', 'Látex interior, cobertura 35 m²/galón'],

  // Pintura esmalte
  ['Promart Homecenter Carapungo', 'Pintura esmalte', 18.50, 'Pinturas Cóndor', 'Esmalte alquídico brillante, secado rápido'],
  ['Kywi La Prensa',              'Pintura esmalte', 16.90, 'Pinturas Unidas', 'Esmalte brillante anticorrosivo'],
  ['Kywi El Bosque',              'Pintura esmalte', 16.90, 'Pinturas Unidas', 'Esmalte brillante anticorrosivo'],
  ['Kywi 10 de Agosto',           'Pintura esmalte', 16.50, 'Pinturas Unidas', 'Esmalte brillante anticorrosivo'],
  ['MegaKywi Granados',           'Pintura esmalte', 18.50, 'Pinturas Cóndor', 'Esmalte alquídico brillante, secado rápido'],

  // Placa de yeso
  ['Promart Homecenter Carapungo', 'Placa de yeso estándar 1.22×2.44 m', 11.20, 'Gyplac', 'Placa ST estándar 12.7 mm, uso interior'],
  ['Promart Homecenter Granados',  'Placa de yeso estándar 1.22×2.44 m', 11.20, 'Gyplac', 'Placa ST estándar 12.7 mm, uso interior'],
  ['Kywi El Bosque',              'Placa de yeso estándar 1.22×2.44 m', 11.05, 'Gyptech', 'Placa ST 12.7 mm, 1.22×2.44 m'],
  ['Kywi La Prensa',              'Placa de yeso estándar 1.22×2.44 m', 11.05, 'Gyptech', 'Placa ST 12.7 mm, 1.22×2.44 m'],
  ['MegaKywi Granados',           'Placa de yeso estándar 1.22×2.44 m', 11.20, 'Gyplac', 'Placa ST estándar 12.7 mm, uso interior'],

  // Impermeabilizante
  ['Promart Homecenter Carapungo', 'Impermeabilizante líquido', 19.50, 'Sika', 'SikaTop Seal 107, bicomponente, 8 kg'],
  ['Promart Homecenter Granados',  'Impermeabilizante líquido', 19.50, 'Sika', 'SikaTop Seal 107, bicomponente, 8 kg'],
  ['Kywi El Bosque',              'Impermeabilizante líquido', 12.18, 'Sika', 'Zero Salitre, 1.2 litros'],
  ['Kywi La Prensa',              'Impermeabilizante líquido', 12.18, 'Sika', 'Zero Salitre, 1.2 litros'],
  ['MegaKywi Granados',           'Impermeabilizante líquido', 19.50, 'Sika', 'SikaTop Seal 107, bicomponente, 8 kg'],

  // Tubo PVC desagüe 110mm
  ['Promart Homecenter Carapungo', 'Tubo PVC desagüe 110 mm × 3 m', 9.20, 'Plastigama', 'PVC presión desagüe, norma NTE INEN 1373'],
  ['Promart Homecenter Granados',  'Tubo PVC desagüe 110 mm × 3 m', 9.20, 'Plastigama', 'PVC presión desagüe, norma NTE INEN 1373'],
  ['Kywi El Bosque',              'Tubo PVC desagüe 110 mm × 3 m', 8.90, 'Plastigama', 'PVC desagüe, norma NTE INEN 1373'],
  ['Kywi El Recreo',              'Tubo PVC desagüe 110 mm × 3 m', 8.90, 'Mexichem', 'PVC desagüe, norma NTE INEN 1373'],
  ['Kywi Quitumbe',               'Tubo PVC desagüe 110 mm × 3 m', 8.90, 'Mexichem', 'PVC desagüe, norma NTE INEN 1373'],
  ['MegaKywi Los Chillos',        'Tubo PVC desagüe 110 mm × 3 m', 8.90, 'Plastigama', 'PVC desagüe, norma NTE INEN 1373'],

  // Arena lavada de río
  ['Promart Homecenter Carapungo', 'Arena lavada de río', 22.00, 'Agrograma', 'Arena de río lavada, granulometría fina'],
  ['Kywi El Bosque',              'Arena lavada de río', 20.00, 'Áridos del Norte', 'Arena de río lavada, m³'],
  ['Kywi 10 de Agosto',           'Arena lavada de río', 20.00, 'Áridos del Norte', 'Arena de río lavada, m³'],
  ['Kywi El Recreo',              'Arena lavada de río', 19.50, 'Áridos del Sur', 'Arena de río lavada, m³'],
  ['Kywi Quitumbe',               'Arena lavada de río', 19.50, 'Áridos del Sur', 'Arena de río lavada, m³'],
  ['MegaKywi Los Chillos',        'Arena lavada de río', 20.00, 'Áridos del Norte', 'Arena de río lavada, m³'],
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB\n');

  // Usuario sistema para los reportes del seed
  let sistema = await Usuario.findOne({ email: 'sistema@ferreprecios.ec' });
  if (!sistema) {
    const hash = await bcrypt.hash('seed_interno_2024', 10);
    sistema = await Usuario.create({
      nombre: 'Sistema',
      email: 'sistema@ferreprecios.ec',
      passwordHash: hash,
      rol: 'comprador',
    });
    console.log('  ✓ Usuario sistema creado');
  }

  // Índice de materiales por nombre
  console.log('Cargando materiales...');
  const materialMap = {};
  for (const datos of MATERIALES) {
    let mat = await Material.findOne({ nombre: datos.nombre });
    if (!mat) {
      mat = await Material.create(datos);
      console.log(`  ✓ Material creado: ${mat.nombre}`);
    } else {
      console.log(`  → Ya existe: ${mat.nombre}`);
    }
    materialMap[mat.nombre] = mat._id;
  }

  // Índice de ferreterías por nombre
  const ferreterias = await Ferreteria.find();
  const ferreteriaMap = {};
  for (const f of ferreterias) {
    ferreteriaMap[f.nombre] = f._id;
  }

  // Insertar precios (salta los que ya existen para esa combinación)
  console.log('\nCargando precios...');
  let insertados = 0;
  let omitidos = 0;
  let errores = 0;

  for (const [nombreFerreteria, nombreMaterial, precio, marca, caracteristicas] of PRECIOS) {
    const materialId = materialMap[nombreMaterial];
    const ferreteriaId = ferreteriaMap[nombreFerreteria];

    if (!materialId) {
      console.log(`  ✗ Material no encontrado: "${nombreMaterial}"`);
      errores++;
      continue;
    }
    if (!ferreteriaId) {
      console.log(`  ✗ Ferretería no encontrada: "${nombreFerreteria}"`);
      errores++;
      continue;
    }

    const existe = await ReportePrecio.findOne({ material: materialId, ferreteria: ferreteriaId, marca });
    if (existe) {
      omitidos++;
      continue;
    }

    await ReportePrecio.create({
      material: materialId,
      ferreteria: ferreteriaId,
      usuario: sistema._id,
      precio,
      marca,
      caracteristicas,
    });
    insertados++;
  }

  console.log(`\n✓ Materiales: ${Object.keys(materialMap).length}`);
  console.log(`✓ Precios insertados: ${insertados}`);
  console.log(`→ Precios omitidos (ya existían): ${omitidos}`);
  if (errores > 0) console.log(`✗ Errores: ${errores}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
