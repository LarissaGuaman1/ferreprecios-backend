const mongoose = require('mongoose');

// Se conecta a MongoDB Atlas usando la URL guardada en .env.
// mongoose.connect devuelve una Promise, por eso la función es async.
async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    // Si no hay base de datos, no tiene sentido seguir corriendo el servidor.
    process.exit(1);
  }
}

module.exports = conectarDB;
