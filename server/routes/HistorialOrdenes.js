const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; 
const db = require('../models'); 
const HistorialOrdenes = require('../models/HistorialOrdenes');


// -- OBTENER TODOS LOS AUTOS -- //
router.get('/', async (req, res) => {
  try {
    const orden = await db.HistorialOrdenes.findAll();
    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al obtener autos:', error);
    res.status(500).json({ error: 'Error al obtener autos' });
  }
});


router.post('/', async (req, res) => {
  try {
    // Crear la orden de trabajo en HistorialOrdenes con los datos del cuerpo de la solicitud
    const nuevaOrdenHistorial = await db.HistorialOrdenes.create({
      fecha_inicio: req.body.fecha_inicio,
      fecha_termino: req.body.fecha_termino,
      descripcion: req.body.descripcion,
      monto_total: req.body.monto_total,
      monto_pagado: req.body.monto_pagado,
      matricula_vehiculo: req.body.matricula_vehiculo,
      cliente_rut: req.body.cliente_rut,
      fecha_eliminacion: req.fecha_eliminacion
    });

    res.status(201).json(nuevaOrdenHistorial); // Responder con la orden creada
  } catch (error) {
    console.error('Error al crear el historial de orden:', error);
    res.status(500).json({ error: 'Error al crear el historial de la orden de trabajo' });
  }
});

module.exports = router;

