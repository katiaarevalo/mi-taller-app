const express = require('express');
const router = express.Router();
const { Reserva } = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');

// Crear una nueva reserva
router.post('/', verifyToken, async (req, res) => {
    try {
        const nuevaReserva = await Reserva.create(req.body);
        res.status(201).json(nuevaReserva);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

// Obtener todas las reservas
router.get('/', verifyToken, async (req, res) => {
    try {
        const reservas = await Reserva.findAll();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

// Eliminar una reserva
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        await reserva.destroy();
        res.status(200).json({ message: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
});

module.exports = router;
