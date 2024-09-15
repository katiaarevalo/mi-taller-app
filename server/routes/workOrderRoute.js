const express = require('express');
const WorkOrder = require('../models').workOrder; // Asegúrate de que la ruta sea correcta
const { verifyToken } = require('../middleware/authMiddleware'); // Añade un middleware para verificar tokens

const router = express.Router();

// Crear una nueva orden de trabajo
router.post('/', verifyToken, async (req, res) => {
  const { description, amount, status, startDate, endDate } = req.body;
  try {
    const workOrder = await WorkOrder.create({ description, amount, status, startDate, endDate });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating work order' });
  }
});

// Obtener todas las órdenes de trabajo
router.get('/', verifyToken, async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll();
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching work orders' });
  }
});

module.exports = router;