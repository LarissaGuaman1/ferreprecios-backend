const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { obtenerPerfil, actualizarFotoPerfil, actualizarNombre } = require('../controllers/usuarioController');

const router = express.Router();

router.get('/me', authMiddleware, obtenerPerfil);
router.put('/me/foto', authMiddleware, actualizarFotoPerfil);
router.put('/me/nombre', authMiddleware, actualizarNombre);

module.exports = router;
