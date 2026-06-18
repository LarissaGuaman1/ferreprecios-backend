const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { listarFerreterias, crearFerreteria } = require('../controllers/ferreteriaController');

const router = express.Router();

router.get('/', listarFerreterias);
router.post('/', authMiddleware, crearFerreteria);

module.exports = router;
