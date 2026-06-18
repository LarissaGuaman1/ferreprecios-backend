const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { buscarMateriales, obtenerPreciosDeMaterial, crearMaterial } = require('../controllers/materialController');

const router = express.Router();

router.get('/', buscarMateriales);
router.get('/:id/precios', obtenerPreciosDeMaterial);
router.post('/', authMiddleware, crearMaterial);

module.exports = router;
