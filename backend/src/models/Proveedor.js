const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
    nombre_empresa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_contacto: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    marca_distribuidora: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'proveedores'
});

module.exports = Proveedor;
