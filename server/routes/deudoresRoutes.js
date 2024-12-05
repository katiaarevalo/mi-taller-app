const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware en todas las rutas.
router.use(verifyToken);

// -- CREAR UN DEUDOR MOROSO -- //
router.post('/', async (req, res) => {
    try {
        const newDeudor = await db.Deudor.create(req.body);
        res.status(201).json(newDeudor);
    } catch (error) {
        console.error('Error al crear deudor:', error);
        res.status(500).json({ error: 'Error al crear deudor' });
    }
});

// -- OBTENER TODOS LOS DEUDORES -- //
router.get('/', async (req, res) => {
    try {
        const deudores = await db.Deudor.findAll();
        res.status(200).json(deudores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los deudores' });
    }
});

// -- OBTENER UN DEUDOR POR RUT DEL CLIENTE -- //
router.get('/:rut', async (req, res) => {
    try {
        const deudor = await db.Deudor.findOne({ where: { cliente_rut: req.params.rut } });
        if (!deudor) {
            return res.status(404).json({ error: 'Deudor no encontrado' });
        }
        res.status(200).json(deudor);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el deudor' });
    }
});

// -- ACTUALIZAR UN DEUDOR POR RUT DEL CLIENTE (PROTEGIDO) -- //
router.put('/:rut', async (req, res) => {
    try {
        const [updated] = await db.Deudor.update(req.body, {
            where: { cliente_rut: req.params.rut }
        });
        if (!updated) return res.status(404).json({ error: 'Deudor no encontrado' });
        const updatedDeudor = await db.Deudor.findOne({ where: { cliente_rut: req.params.rut } });
        res.status(200).json(updatedDeudor);
    } catch (error) {
        console.error('Error al actualizar deudor:', error);
        res.status(500).json({ error: 'Error al actualizar el deudor' });
    }
});

// -- ELIMINAR UN DEUDOR POR RUT DEL CLIENTE (PROTEGIDO) -- //
router.delete('/:rut', async (req, res) => {
    try {
        const deleted = await db.Deudor.destroy({
            where: { cliente_rut: req.params.rut }
        });
        if (!deleted) return res.status(404).json({ error: 'Deudor no encontrado' });
        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar deudor:', error);
        res.status(500).json({ error: 'Error al eliminar el deudor' });
    }
});

module.exports = router;