const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Producto = require('./Producto');

const Venta = sequelize.define('Venta', {
    producto_id: {
        type: DataTypes.INTEGER,
        references: { model: Producto, key: 'id' }
    },
    cantidad_vendida: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    vendedor_nombre: {
        type: DataTypes.STRING, // <--- Debe ser STRING para que acepte letras
        allowNull: true
    }
}, {
    tableName: 'ventas'
});

Venta.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(Venta, { foreignKey: 'producto_id' });

module.exports = Venta;


