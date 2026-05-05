const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas vinculadas a las funciones del controlador
router.get('/', ventaController.obtenerVentas);
router.post('/', ventaController.registrarVenta);
router.put('/:id', ventaController.actualizarVenta); // <-- Aquí era el error
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;
