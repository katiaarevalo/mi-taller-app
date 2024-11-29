const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { OrdenDeTrabajo } = require('../models');  
const db = require('../models');

// -- CREAR ORDEN DE TRABAJO -- //
router.post('/', verifyToken, async (req, res) => {
    try {
      const nuevaOrden = await OrdenDeTrabajo.create(req.body);
      res.status(201).json(nuevaOrden);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden de trabajo' });
    }
  });

// -- OBTENER TODAS LAS ORDEN DE TRABAJO -- //
router.get('/', verifyToken, async (req, res) => {
  try {
    const ordenes = await OrdenDeTrabajo.findAll();
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes de trabajo' });
  }
});

// -- ORDEN DE TRABAJO POR ID -- //
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const orden = await OrdenDeTrabajo.findByPk(req.params.id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden de trabajo' });
  }
});

// -- MODIFICAR ORDEN DE TRABAJO -- //
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const orden = await OrdenDeTrabajo.findByPk(req.params.id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    await orden.update(req.body);
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la orden de trabajo' });
  }
});

/*// -- ELIMINAR ORDEN DE TRABAJO -- //
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const orden = await OrdenDeTrabajo.findByPk(req.params.id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    //modifica para la de H
    await orden.destroy();
    res.status(200).json({ message: 'Orden de trabajo eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la orden de trabajo' });
  }
});
*/
// -- ELIMINAR ORDEN DE TRABAJO Y MOVER A HISTORIAL -- //
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Buscar la orden de trabajo por ID
    const orden = await db.OrdenDeTrabajo.findByPk(req.params.id);
    
    if (!orden) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    // Obtener la fecha de eliminación (fecha actual)
    const fechaEliminacion = new Date();

    // Crear un historial de la orden antes de eliminarla
    const historialOrden = await db.HistorialOrdenes.create({
      fecha_inicio: orden.fecha_inicio,
      fecha_termino: orden.fecha_termino,
      descripcion: orden.descripcion,
      monto_total: orden.monto_total,
      monto_pagado: orden.monto_pagado,
      matricula_vehiculo: orden.matricula_vehiculo,
      cliente_rut: orden.cliente_rut,
      fecha_eliminacion: fechaEliminacion // Asignar la fecha actual
    });

    // Si la orden se movió correctamente al historial, ahora eliminarla de la tabla 'OrdenDeTrabajo'
    await orden.destroy();

    // Responder con éxito
    res.status(200).json({ 
      message: 'Orden de trabajo movida a Historial y eliminada correctamente', 
      historialOrden 
    });
  } catch (error) {
    console.error('Error al eliminar la orden de trabajo:', error);
    res.status(500).json({ error: 'Error al mover y eliminar la orden de trabajo' });
  }
});


    
module.exports = router;