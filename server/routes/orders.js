
const express = require('express');
const router = express.Router();
const { OrdenDeTrabajo } = require('../models');

// Obtener órdenes de trabajo con fechas de inicio y término
router.get('/work-orders', async (req, res) => {
    try {
        const workOrders = await OrdenDeTrabajo.findAll({
            attributes: ['descripcion', 'fecha_inicio', 'fecha_termino']
        });
        res.json(workOrders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes de trabajo' });
    }
});

module.exports = router;
