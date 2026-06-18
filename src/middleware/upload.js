const multer = require('multer');

// memoryStorage: el archivo queda disponible como un buffer en
// req.file.buffer (no se guarda en disco). Como solo lo necesitamos
// de paso para reenviarlo a Cloudinary, no tiene sentido escribirlo
// al disco del servidor primero.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB por foto
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('El archivo debe ser una imagen'));
    }
    cb(null, true);
  },
});

module.exports = upload;
