const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.registro = async (req, res) => {
  try {
    const { email, contraseña, nombre } = req.body;

    // Validar que los datos existan
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      email,
      contraseña: contraseñaEncriptada,
      nombre: nombre || 'Usuario'
    });

    // Generar token
    const token = jwt.sign({ id: nuevoUsuario.id, email: nuevoUsuario.email }, process.env.JWT_SECRET || 'secreto', { expiresIn: '24h' });

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: { id: nuevoUsuario.id, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validar que los datos existan
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'secreto', { expiresIn: '24h' });

    res.json({ 
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    const usuario = await Usuario.findByPk(decoded.id);

    res.json({ 
      valido: true,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
    });
  } catch (error) {
    res.status(401).json({ valido: false, error: 'Token inválido' });
  }
};
