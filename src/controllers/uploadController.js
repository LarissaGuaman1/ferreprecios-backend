const cloudinary = require('../config/cloudinary');

async function subirFotoReporte(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }

    // Cloudinary acepta subir una imagen como "data URI": un string que
    // empieza con "data:<tipo>;base64,<contenido>". Es la forma más
    // simple de mandarle el archivo sin usar streams.
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const resultado = await cloudinary.uploader.upload(dataUri, {
      // Carpeta dentro de tu cuenta de Cloudinary, para mantener
      // ordenadas las fotos de evidencia separadas de otras subidas.
      folder: 'ferreprecios/reportes',
    });

    return res.status(201).json({ url: resultado.secure_url });
  } catch (error) {
    return res.status(500).json({ message: 'Error al subir la foto', detalle: error.message });
  }
}

module.exports = { subirFotoReporte };
