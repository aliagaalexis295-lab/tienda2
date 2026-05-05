const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    precio: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    stock: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    // NUEVOS CAMPOS:
    descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: true // Puede quedar vacío si no hay descripción
        
    },
    categoria: { 
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: 'Sin categoría'
    }
});

module.exports = Producto;

