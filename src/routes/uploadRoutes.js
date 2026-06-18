const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { subirFotoReporte } = require('../controllers/uploadController');

const router = express.Router();

// Una ruta puede tener varios middlewares encadenados: Express los
// ejecuta en orden, de izquierda a derecha, antes de llegar al
// controlador final.
router.post('/foto', authMiddleware, upload.single('foto'), subirFotoReporte);

module.exports = router;
