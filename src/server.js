require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const ferreteriaRoutes = require('./routes/ferreteriaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors()); // permite que la app Flutter (otro origen) le hable a esta API
app.use(express.json()); // parsea el body de las peticiones como JSON

// Todas las rutas de autenticación quedan bajo el prefijo /api/auth,
// coincidiendo con lo que espera AuthRepository en Flutter (/auth/login, /auth/register).
app.use('/api/auth', authRoutes);

// Buscador de materiales y comparador de precios.
app.use('/api/materiales', materialRoutes);

// Subida de fotos de evidencia (requiere estar logueado).
app.use('/api/uploads', uploadRoutes);

// Crear reportes de precio (requiere estar logueado).
app.use('/api/reportes', reporteRoutes);

// Listado de ferreterías (para elegir en el wizard de reporte).
app.use('/api/ferreterias', ferreteriaRoutes);

// Datos del usuario logueado (pantalla de Perfil).
app.use('/api/usuarios', usuarioRoutes);

// Ruta simple para confirmar que el servidor está vivo.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Manejador de errores GLOBAL: Express lo reconoce porque tiene 4
// argumentos (con "err" primero). Si algún middleware (ej: multer,
// al rechazar un archivo) o controlador lanza un error sin atraparlo,
// cae aquí en vez de mostrar la página HTML de error por defecto de
// Express, que rompería el jsonDecode() del lado de Flutter.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
