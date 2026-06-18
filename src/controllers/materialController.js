const Material = require('../models/Material');
const Ferreteria = require('../models/Ferreteria');
const ReportePrecio = require('../models/ReportePrecio');
const calcularEstado = require('../utils/estadoPrecio');

// Si viene un "sector" en la URL, traduce eso a una lista de IDs de
// ferreterías de ese sector (porque ReportePrecio no guarda el sector
// directamente, lo guarda Ferreteria).
async function idsFerreteriasDeSector(sector) {
  if (!sector) return null;
  const ferreterias = await Ferreteria.find({ sector }).select('_id');
  return ferreterias.map((f) => f._id);
}

// GET /api/materiales?busqueda=cemento&sector=Norte
// Lista de materiales que coinciden con la búsqueda, cada uno con
// su precio MÁS BAJO encontrado (para mostrar en la lista de resultados).
async function buscarMateriales(req, res) {
  try {
    const { busqueda, sector } = req.query;

    const filtroMaterial = {};
    if (busqueda) {
      // $regex con "i" = búsqueda de texto sin distinguir mayúsculas/minúsculas.
      filtroMaterial.nombre = { $regex: busqueda, $options: 'i' };
    }

    const materiales = await Material.find(filtroMaterial).sort({ nombre: 1 });
    const idsSector = await idsFerreteriasDeSector(sector);

    // Promise.all: lanzamos todas las búsquedas de "mejor precio" en
    // paralelo en vez de una por una, para que la respuesta sea rápida.
    const resultados = await Promise.all(
      materiales.map(async (material) => {
        const filtroReporte = { material: material._id };
        if (idsSector) {
          filtroReporte.ferreteria = { $in: idsSector };
        }

        const mejorReporte = await ReportePrecio.findOne(filtroReporte)
          .sort({ precio: 1 }) // el más barato primero
          .populate('ferreteria', 'nombre sector');

        return {
          id: material._id,
          nombre: material.nombre,
          categoria: material.categoria,
          unidadMedida: material.unidadMedida,
          mejorPrecio: mejorReporte
            ? {
                valor: mejorReporte.precio,
                ferreteria: mejorReporte.ferreteria.nombre,
                estado: calcularEstado(mejorReporte),
              }
            : null,
        };
      })
    );

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar materiales', detalle: error.message });
  }
}

// GET /api/materiales/:id/precios?sector=Norte
// Todas las ferreterías que reportaron precio para ESE material,
// ordenadas de menor a mayor.
async function obtenerPreciosDeMaterial(req, res) {
  try {
    const { id } = req.params;
    const { sector } = req.query;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }

    const filtroReporte = { material: material._id };
    const idsSector = await idsFerreteriasDeSector(sector);
    if (idsSector) {
      filtroReporte.ferreteria = { $in: idsSector };
    }

    const reportes = await ReportePrecio.find(filtroReporte)
      .sort({ precio: 1 })
      .populate('ferreteria', 'nombre sector direccion');

    return res.json({
      material: {
        id: material._id,
        nombre: material.nombre,
        categoria: material.categoria,
        unidadMedida: material.unidadMedida,
      },
      precios: reportes.map((reporte) => ({
        id: reporte._id,
        valor: reporte.precio,
        fotoUrl: reporte.fotoUrl,
        confirmaciones: reporte.confirmaciones,
        estado: calcularEstado(reporte),
        ferreteria: {
          id: reporte.ferreteria._id,
          nombre: reporte.ferreteria.nombre,
          sector: reporte.ferreteria.sector,
          direccion: reporte.ferreteria.direccion,
        },
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener precios', detalle: error.message });
  }
}

// POST /api/materiales (requiere estar logueado)
// El usuario no encontró el material en la búsqueda y quiere
// registrarlo para poder reportarle un precio.
async function crearMaterial(req, res) {
  try {
    const { nombre, categoria, unidadMedida } = req.body;

    if (!nombre || !categoria || !unidadMedida) {
      return res.status(400).json({ message: 'Nombre, categoría y unidad de medida son obligatorios' });
    }

    const material = await Material.create({ nombre, categoria, unidadMedida });

    return res.status(201).json({
      id: material._id,
      nombre: material.nombre,
      categoria: material.categoria,
      unidadMedida: material.unidadMedida,
      mejorPrecio: null,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el material', detalle: error.message });
  }
}

module.exports = { buscarMateriales, obtenerPreciosDeMaterial, crearMaterial };
