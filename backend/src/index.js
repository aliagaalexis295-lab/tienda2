const express = require('express');
const sequelize = require('./config/db');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar modelos para que se registren en Sequelize
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const Proveedor = require('./models/Proveedor');
const Venta = require('./models/Venta');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Importante que esté arriba
app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/proveedores', proveedorRoutes);

// --- SERVIR FRONTEND (OPCIONAL) ---
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Servidor y Base de Datos listos.');
    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en: http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error('❌ Error de conexión:', error));
