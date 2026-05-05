const Proveedor = require('../models/Proveedor');

exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error });
    }
};

exports.crearProveedor = async (req, res) => {
    try {
        const nuevo = await Proveedor.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error });
    }
};

exports.actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        await Proveedor.update(req.body, { where: { id } });
        res.json({ mensaje: "Proveedor actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error });
    }
};

exports.eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        await Proveedor.destroy({ where: { id } });
        res.json({ mensaje: "Proveedor eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error });
    }
};

