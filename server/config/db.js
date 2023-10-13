
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.URI + '/'+ process.env.DATABASE);

mongoose.connection.on('connected', () => {
  console.log('Conectado a mongodb');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

module.exports = mongoose;