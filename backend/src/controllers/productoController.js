const Producto = require('../models/Producto');

// 1. Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", error });
    }
};

// 2. Crear un nuevo producto
exports.crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el producto", error });
    }
};

// 3. Editar un producto existente
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [editado] = await Producto.update(req.body, { where: { id } });
        if (editado) {
            res.json({ mensaje: "Producto actualizado con éxito" });
        } else {
            res.status(404).json({ mensaje: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar", error });
    }
};

// 4. ELIMINAR PRODUCTO (Corregido para evitar errores de MySQL y Bloqueos)
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        // Cargamos el modelo de Venta aquí adentro para evitar que el servidor choque (app crashed)
        const Venta = require('../models/Venta');

        // Paso A: Borramos las ventas asociadas a este ID (Limpieza de seguridad)
        await Venta.destroy({ where: { producto_id: id } });

        // Paso B: Ahora borramos el producto de la tabla principal
        const resultado = await Producto.destroy({ where: { id } });

        if (resultado) {
            res.json({ mensaje: "Producto y sus registros eliminados correctamente" });
        } else {
            res.status(404).json({ mensaje: "Ese producto no existe en la base de datos" });
        }
    } catch (error) {
        console.error("Error en Delete:", error);
        res.status(500).json({ mensaje: "No se pudo eliminar el producto", error });
    }
};

