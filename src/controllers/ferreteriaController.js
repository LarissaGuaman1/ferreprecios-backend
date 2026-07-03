const Ferreteria = require('../models/Ferreteria');
const Material = require('../models/Material');
const ReportePrecio = require('../models/ReportePrecio');
const SECTORES = require('../utils/sectores');

function formatearFerreteria(f) {
  return {
    id: f._id,
    nombre: f.nombre,
    direccion: f.direccion,
    sector: f.sector,
    telefono: f.telefono || null,
    horario: f.horario || null,
    descripcion: f.descripcion || null,
    fotoUrl: f.fotoUrl || null,
    tieneDueno: f.dueno != null,
    ubicacion: (f.ubicacion?.lat != null && f.ubicacion?.lng != null)
      ? { lat: f.ubicacion.lat, lng: f.ubicacion.lng }
      : null,
  };
}

// GET /api/ferreterias?sector=Norte
async function listarFerreterias(req, res) {
  try {
    const { sector } = req.query;
    const filtro = sector ? { sector } : {};

    const ferreterias = await Ferreteria.find(filtro).sort({ nombre: 1 });

    return res.json(ferreterias.map(formatearFerreteria));
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar ferreterías', detalle: error.message });
  }
}

// POST /api/ferreterias — compradores agregan ferreterías que no existen en el wizard
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

    return res.status(201).json(formatearFerreteria(ferreteria));
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la ferretería', detalle: error.message });
  }
}

// GET /api/ferreterias/mia — el dueño obtiene los datos de su ferretería
async function obtenerMiFerreteria(req, res) {
  try {
    const ferreteria = await Ferreteria.findOne({ dueno: req.usuarioId });

    if (!ferreteria) {
      return res.status(404).json({ message: 'Todavía no has registrado tu ferretería' });
    }

    return res.json(formatearFerreteria(ferreteria));
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la ferretería', detalle: error.message });
  }
}

// PUT /api/ferreterias/mia — crea o actualiza la ferretería del dueño
async function guardarMiFerreteria(req, res) {
  try {
    const { nombre, direccion, sector, telefono, horario, descripcion } = req.body;

    if (!nombre || !direccion || !sector) {
      return res.status(400).json({ message: 'Nombre, dirección y sector son obligatorios' });
    }

    if (!SECTORES.includes(sector)) {
      return res.status(400).json({ message: `Sector inválido. Debe ser uno de: ${SECTORES.join(', ')}` });
    }

    // upsert: si ya existe una con este dueno la actualiza, si no la crea
    const ferreteria = await Ferreteria.findOneAndUpdate(
      { dueno: req.usuarioId },
      { nombre, direccion, sector, telefono, horario, descripcion, dueno: req.usuarioId },
      { new: true, upsert: true, runValidators: true },
    );

    return res.json(formatearFerreteria(ferreteria));
  } catch (error) {
    return res.status(500).json({ message: 'Error al guardar la ferretería', detalle: error.message });
  }
}

// PUT /api/ferreterias/mia/foto — actualiza la foto de la ferretería del dueño
async function actualizarFotoFerreteria(req, res) {
  try {
    const { fotoUrl } = req.body;

    if (!fotoUrl) {
      return res.status(400).json({ message: 'fotoUrl es obligatorio' });
    }

    const ferreteria = await Ferreteria.findOneAndUpdate(
      { dueno: req.usuarioId },
      { fotoUrl },
      { new: true },
    );

    if (!ferreteria) {
      return res.status(404).json({ message: 'Ferretería no encontrada. Guarda los datos primero.' });
    }

    return res.json({ fotoUrl: ferreteria.fotoUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la foto', detalle: error.message });
  }
}

// POST /api/ferreterias/mia/catalogo
// El dueño sube un CSV con su lista de precios. El backend crea los
// materiales que no existan y genera un ReportePrecio por cada fila.
// Formato esperado (primera fila = encabezado, se ignora):
//   material,precio,unidad,categoria
//   Cemento Portland 50kg,8.50,saco,Cementos
async function importarCatalogo(req, res) {
  try {
    const { csv } = req.body;
    if (!csv || typeof csv !== 'string' || csv.trim().length === 0) {
      return res.status(400).json({ message: 'El campo csv es obligatorio' });
    }

    const ferreteria = await Ferreteria.findOne({ dueno: req.usuarioId });
    if (!ferreteria) {
      return res.status(404).json({ message: 'Primero registra los datos de tu ferretería' });
    }

    const lineas = csv
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lineas.length < 2) {
      return res.status(400).json({ message: 'El archivo debe tener encabezado y al menos una fila de datos' });
    }

    // Saltamos la primera fila (encabezado)
    const filasDatos = lineas.slice(1);
    let importados = 0;
    const errores = [];

    for (let i = 0; i < filasDatos.length; i++) {
      const numeroFila = i + 2; // +2: 1 de base + 1 del encabezado

      // Separador ";" permite usar comas dentro de las características
      const columnas = filasDatos[i].split(';').map((c) => c.trim());
      const [nombre, marca, precioStr, unidad, categoria = 'General', caracteristicas = ''] = columnas;

      if (!nombre || !marca || !precioStr || !unidad) {
        errores.push({ fila: numeroFila, motivo: 'Faltan campos: se esperan material, marca, precio y unidad' });
        continue;
      }

      const precio = parseFloat(precioStr);
      if (Number.isNaN(precio) || precio <= 0) {
        errores.push({ fila: numeroFila, motivo: `Precio inválido: "${precioStr}"` });
        continue;
      }

      try {
        // Busca el material por nombre (sin importar mayúsculas/minúsculas).
        // Si no existe, lo crea para que aparezca en el buscador de toda la app.
        let material = await Material.findOne({ nombre: new RegExp(`^${nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
        if (!material) {
          material = await Material.create({ nombre, categoria, unidadMedida: unidad });
        }

        await ReportePrecio.create({
          material: material._id,
          ferreteria: ferreteria._id,
          usuario: req.usuarioId,
          precio,
          marca,
          caracteristicas: caracteristicas || undefined,
        });

        importados++;
      } catch (e) {
        errores.push({ fila: numeroFila, motivo: e.message });
      }
    }

    return res.json({ importados, errores });
  } catch (error) {
    return res.status(500).json({ message: 'Error al importar el catálogo', detalle: error.message });
  }
}

module.exports = {
  listarFerreterias,
  crearFerreteria,
  obtenerMiFerreteria,
  guardarMiFerreteria,
  actualizarFotoFerreteria,
  importarCatalogo,
};
