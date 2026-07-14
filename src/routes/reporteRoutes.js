const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { crearReporte, eliminarReporte } = require('../controllers/reporteController');

const router = express.Router();

router.post('/', authMiddleware, crearReporte);
router.delete('/:id', authMiddleware, eliminarReporte);

module.exports = router;
