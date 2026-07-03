const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  listarFerreterias,
  crearFerreteria,
  obtenerMiFerreteria,
  guardarMiFerreteria,
  actualizarFotoFerreteria,
  importarCatalogo,
} = require('../controllers/ferreteriaController');

const router = express.Router();

// Pública: cualquiera puede ver la lista de ferreterías
router.get('/', listarFerreterias);

// Dueño: gestión de su propia ferretería
router.get('/mia', authMiddleware, obtenerMiFerreteria);
router.put('/mia', authMiddleware, guardarMiFerreteria);
router.put('/mia/foto', authMiddleware, actualizarFotoFerreteria);

// Dueño: importa su lista de precios desde un CSV
router.post('/mia/catalogo', authMiddleware, importarCatalogo);

// Comprador: agrega una ferretería que no existe en el wizard de reporte
router.post('/', authMiddleware, crearFerreteria);

module.exports = router;
