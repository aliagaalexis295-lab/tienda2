const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

// OBTENER TODAS LAS VENTAS
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({ include: Producto });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener ventas", error });
    }
};

// REGISTRAR VENTA (POST)
exports.registrarVenta = async (req, res) => {
    try {
        const { producto_id, cantidad_vendida, vendedor_nombre } = req.body;
        const producto = await Producto.findByPk(producto_id);

        if (!producto || producto.stock < cantidad_vendida) {
            return res.status(400).json({ mensaje: "Stock insuficiente o producto inexistente" });
        }

        const monto_total = producto.precio * cantidad_vendida;
        const nuevaVenta = await Venta.create({
            producto_id,
            cantidad_vendida,
            monto_total,
            vendedor_nombre
        });

        producto.stock -= cantidad_vendida;
        await producto.save();

        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar la venta", error });
    }
};

// ACTUALIZAR VENTA (PUT) - Esta es la que estaba fallando
exports.actualizarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        await Venta.update(req.body, { where: { id } });
        res.json({ mensaje: "Venta actualizada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar", error });
    }
};

// ELIMINAR VENTA (DELETE)
exports.eliminarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        await Venta.destroy({ where: { id } });
        res.json({ mensaje: "Venta eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar", error });
    }
};

