const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga los datos del archivo .env

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql' // Le decimos que nuestra base de datos es MySQL
    }
);

module.exports = sequelize; // Exportamos la conexión para usarla en otros archivos

