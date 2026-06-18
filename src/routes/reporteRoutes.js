const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { crearReporte } = require('../controllers/reporteController');

const router = express.Router();

router.post('/', authMiddleware, crearReporte);

module.exports = router;
