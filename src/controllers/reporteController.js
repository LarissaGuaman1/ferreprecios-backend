const Material = require('../models/Material');
const Ferreteria = require('../models/Ferreteria');
const ReportePrecio = require('../models/ReportePrecio');
const Usuario = require('../models/Usuario');

const PUNTOS_POR_REPORTAR = 10;

// POST /api/reportes (requiere estar logueado)
async function crearReporte(req, res) {
  try {
    const { materialId, ferreteriaId, precio, fotoUrl, marca, caracteristicas } = req.body;

    if (!materialId || !ferreteriaId || !precio || !fotoUrl || !marca) {
      return res.status(400).json({
        message: 'material, ferretería, precio, foto y marca son obligatorios',
      });
    }

    // Confirmamos que el material y la ferretería realmente existan
    // antes de crear el reporte, para no guardar referencias rotas.
    const [material, ferreteria] = await Promise.all([
      Material.findById(materialId),
      Ferreteria.findById(ferreteriaId),
    ]);

    if (!material) return res.status(404).json({ message: 'Material no encontrado' });
    if (!ferreteria) return res.status(404).json({ message: 'Ferretería no encontrada' });

    const reporte = await ReportePrecio.create({
      material: material._id,
      ferreteria: ferreteria._id,
      usuario: req.usuarioId,
      precio,
      fotoUrl,
      marca,
      caracteristicas: caracteristicas || undefined,
    });

    // $inc suma el valor de forma atómica directo en la base de datos,
    // en vez de leer "puntos", sumarle 10 en JavaScript, y guardar de
    // vuelta (eso podría perder puntos si el usuario reporta dos
    // veces casi al mismo tiempo).
    await Usuario.findByIdAndUpdate(req.usuarioId, {
      $inc: { puntos: PUNTOS_POR_REPORTAR },
    });

    return res.status(201).json({
      id: reporte._id,
      mensaje: `¡Reporte creado! Ganaste ${PUNTOS_POR_REPORTAR} puntos.`,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el reporte', detalle: error.message });
  }
}

module.exports = { crearReporte };
