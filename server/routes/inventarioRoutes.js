// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Asegúrate de que la ruta sea correcta

// -- OBTENER TODOS LOS ARTÍCULOS -- //
router.get('/', async (req, res) => {
    try {
        const items = await db.Inventario.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ message: 'Error al obtener artículos' });
    }
});

// -- AGREGAR UN NUEVO ARTÍCULO -- //
router.post('/', async (req, res) => {
    const { nombre, cantidad, descripcion, categoria} = req.body;
    try {
        const newItem = await db.Inventario.create({ nombre, cantidad, descripcion,categoria });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error al agregar artículo:', error);
        res.status(500).json({ message: 'Error al agregar artículo' });
    }
});

// -- EDITAR UN ARTÍCULO EXISTENTE -- //
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, descripcion,categoria } = req.body;
    try {
        const [updated] = await db.Inventario.update({ nombre, cantidad, descripcion,categoria }, { where: { id } });
        
        if (!updated) return res.status(404).json({ message: 'Artículo no encontrado' });

        const updatedItem = await db.Inventario.findOne({ where: { id } });
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error al actualizar artículo:', error);
        res.status(500).json({ message: 'Error al actualizar artículo' });
    }
});

// -- ELIMINAR UN ARTÍCULO -- //
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await db.Inventario.destroy({ where: { id } });
        
        if (!deleted) return res.status(404).json({ message: 'Artículo no encontrado' });

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        res.status(500).json({ message: 'Error al eliminar artículo' });
    }
});

module.exports = router;