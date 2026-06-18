require('dotenv').config();
const conectarDB = require('./config/db');
const Material = require('./models/Material');
const Ferreteria = require('./models/Ferreteria');
const ReportePrecio = require('./models/ReportePrecio');
const Usuario = require('./models/Usuario');

async function seed() {
  await conectarDB();

  // Borramos lo anterior para que este script se pueda correr varias
  // veces sin duplicar datos.
  await Material.deleteMany({});
  await Ferreteria.deleteMany({});
  await ReportePrecio.deleteMany({});

  const materiales = await Material.insertMany([
    { nombre: 'Cemento Holcim Tipo GU', categoria: 'Cemento', unidadMedida: 'saco 50kg' },
    { nombre: 'Varilla de hierro 12mm', categoria: 'Hierro', unidadMedida: 'unidad' },
    { nombre: 'Pintura Cóndor Satinado', categoria: 'Pintura', unidadMedida: 'galón' },
    { nombre: 'Bloque de cemento 15cm', categoria: 'Bloques', unidadMedida: 'unidad' },
    { nombre: 'Tubo PVC 110mm', categoria: 'Tubería', unidadMedida: 'unidad' },
  ]);

  const ferreterias = await Ferreteria.insertMany([
    { nombre: 'Kywi', direccion: 'Av. Eloy Alfaro N32-30', sector: 'Norte', telefono: '022456789' },
    { nombre: 'Disensa El Inca', direccion: 'Av. Eloy Alfaro y De Los Granados', sector: 'Norte', telefono: '022987654' },
    { nombre: 'Ferrisariato Sur', direccion: 'Av. Maldonado S15-20', sector: 'Sur' },
    { nombre: 'Ferretería Centro Histórico', direccion: 'Calle Venezuela N3-45', sector: 'Centro' },
    { nombre: 'Ferretería Cumbayá', direccion: 'Av. Interoceánica km 12', sector: 'Valles' },
  ]);

  // Los reportes necesitan un usuario "autor". Usamos uno de prueba
  // fijo en vez de inventar un ID random, para no romper la referencia.
  let usuarioSemilla = await Usuario.findOne({ email: 'seed@ferreprecios.com' });
  if (!usuarioSemilla) {
    usuarioSemilla = await Usuario.create({
      nombre: 'Datos de ejemplo',
      email: 'seed@ferreprecios.com',
      passwordHash: 'no-aplica', // este usuario nunca inicia sesión
    });
  }

  const reportes = [
    { material: materiales[0]._id, ferreteria: ferreterias[0]._id, precio: 7.80 },
    { material: materiales[0]._id, ferreteria: ferreterias[1]._id, precio: 7.50 },
    { material: materiales[1]._id, ferreteria: ferreterias[2]._id, precio: 8.90 },
    { material: materiales[2]._id, ferreteria: ferreterias[0]._id, precio: 24.50 },
    { material: materiales[3]._id, ferreteria: ferreterias[3]._id, precio: 0.45 },
    { material: materiales[4]._id, ferreteria: ferreterias[4]._id, precio: 6.30 },
  ].map((r) => ({ ...r, usuario: usuarioSemilla._id }));

  await ReportePrecio.insertMany(reportes);

  console.log(`Insertados: ${materiales.length} materiales, ${ferreterias.length} ferreterías, ${reportes.length} reportes de precio`);
  process.exit(0);
}

seed();
