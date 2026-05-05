const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/verificar', authController.verificarToken);

module.exports = router;
