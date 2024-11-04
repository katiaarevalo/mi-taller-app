const express = require('express');
const router = express.Router();
const { Cotizacion } = require('../models'); // Asegúrate de que este import sea correcto

// Crear una nueva cotización
router.post('/', async (req, res) => {
  try {
    const cotizacion = await Cotizacion.create(req.body);
    return res.status(201).json(cotizacion);
  } catch (error) {
    console.error('Error al crear cotización:', error);
    return res.status(400).json({ error: 'No se pudo crear la cotización' });
  }
});

module.exports = router;
