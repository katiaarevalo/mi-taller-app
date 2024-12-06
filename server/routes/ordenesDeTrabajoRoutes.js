const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { OrdenDeTrabajo } = require('../models');  
const db = require('../models');
const { sequelize } = require('../models');

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
// -- OBTENER CANTIDAD DE ÓRDENES DE TRABAJO POR MES -- //
router.get('/estadisticas/ordenes-por-mes', async (req, res) => {
  try {
    // Consulta para obtener las órdenes de trabajo por mes
    const ordenesPorMes = await db.sequelize.query(`
      SELECT
        MONTH(fecha_inicio) AS mes,
        COUNT(*) AS cantidad
      FROM
        OrdenesDeTrabajo
      GROUP BY
        MONTH(fecha_inicio)
      UNION
      SELECT 1, 0
      UNION
      SELECT 2, 0
      UNION
      SELECT 3, 0
      UNION
      SELECT 4, 0
      UNION
      SELECT 5, 0
      UNION
      SELECT 6, 0
      UNION
      SELECT 7, 0
      UNION
      SELECT 8, 0
      UNION
      SELECT 9, 0
      UNION
      SELECT 10, 0
      UNION
      SELECT 11, 0
      UNION
      SELECT 12, 0
      ORDER BY mes;
    `, { type: db.Sequelize.QueryTypes.SELECT });

    // Devolver los resultados
    res.status(200).json(ordenesPorMes);
  } catch (error) {
    console.error('Error al obtener órdenes por mes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de trabajo por mes' });
  }
});

// -- OBTENER MONTO PROMEDIO POR ORDEN DE TRABAJO -- //
// Ruta para obtener el monto promedio por orden de trabajo
router.get('/monto-promedio-orden', verifyToken, async (req, res) => {
  try {
    const montoPromedioOrden = await db.sequelize.query(`
      SELECT
        AVG(monto_total) AS promedio_monto
      FROM
        OrdenDeTrabajo
    `, { type: db.Sequelize.QueryTypes.SELECT });

    if (!montoPromedioOrden || montoPromedioOrden[0].promedio_monto === null) {
      return res.status(404).json({ error: 'No hay órdenes de trabajo para calcular el promedio' });
    }

    res.json({ promedio_monto: parseFloat(montoPromedioOrden[0].promedio_monto).toFixed(2) });
  } catch (error) {
    console.error('Error al obtener el monto promedio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

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