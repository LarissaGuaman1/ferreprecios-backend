const Ferreteria = require('../models/Ferreteria');
const SECTORES = require('../utils/sectores');

// GET /api/ferreterias?sector=Norte
async function listarFerreterias(req, res) {
  try {
    const { sector } = req.query;
    const filtro = sector ? { sector } : {};

    const ferreterias = await Ferreteria.find(filtro).sort({ nombre: 1 });

    return res.json(
      ferreterias.map((f) => ({
        id: f._id,
        nombre: f.nombre,
        direccion: f.direccion,
        sector: f.sector,
        telefono: f.telefono,
      })),
    );
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar ferreterías', detalle: error.message });
  }
}

// POST /api/ferreterias (requiere estar logueado)
// Permite que un usuario registre una ferretería que todavía no
// existe en la base, ej: encontró un precio más barato en un lugar
// que no aparecía en la lista del wizard de reporte.
async function crearFerreteria(req, res) {
  try {
    const { nombre, direccion, sector, telefono } = req.body;

    if (!nombre || !direccion || !sector) {
      return res.status(400).json({ message: 'Nombre, dirección y sector son obligatorios' });
    }

    if (!SECTORES.includes(sector)) {
      return res.status(400).json({ message: `Sector inválido. Debe ser uno de: ${SECTORES.join(', ')}` });
    }

    const ferreteria = await Ferreteria.create({ nombre, direccion, sector, telefono });

    return res.status(201).json({
      id: ferreteria._id,
      nombre: ferreteria.nombre,
      direccion: ferreteria.direccion,
      sector: ferreteria.sector,
      telefono: ferreteria.telefono,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la ferretería', detalle: error.message });
  }
}

module.exports = { listarFerreterias, crearFerreteria };
