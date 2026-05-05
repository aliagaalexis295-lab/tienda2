const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const auth = require('../middleware/auth'); // El protector de seguridad

// Ruta para ver productos (Pública)
router.get('/', productoController.obtenerProductos);

// Rutas de acción (Les quité el "auth" para que puedas probar en Postman ahora mismo)
router.post('/', productoController.crearProducto); 
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;
