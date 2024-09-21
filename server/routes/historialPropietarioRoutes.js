const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { HistorialPropietario, Auto } = require('../models');

// -- Crear un nuevo registro de historial de propietario -- //
router.post('/', verifyToken, async (req, res) => {
  try {
    const { auto_matricula, cliente_rut } = req.body;
    const nuevoHistorial = await HistorialPropietario.create({ auto_matricula, cliente_rut });
    res.status(201).json(nuevoHistorial);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el historial de propietario' });
  }
});

// -- Obtener todos los registros de historial -- //
router.get('/', verifyToken, async (req, res) => {
  try {
    const historial = await HistorialPropietario.findAll();
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial de propietarios' });
  }
});

// -- Obtener un registro de historial por ID -- //
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const historial = await HistorialPropietario.findByPk(req.params.id);
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

// -- Actualizar un registro de historial por ID -- //
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const historial = await HistorialPropietario.findByPk(req.params.id);
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }
    await historial.update(req.body);
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el historial' });
  }
});

// -- Eliminar un registro de historial por ID -- //
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const historial = await HistorialPropietario.findByPk(req.params.id);
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }
    await historial.destroy();
    res.status(200).json({ message: 'Historial eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el historial' });
  }
});

// -- Cambiar propietario y registrar historial -- //
router.put('/cambiar-propietario/:matricula', verifyToken, async (req, res) => {
  const { cliente_rut } = req.body; // Asumiendo que se pasa el nuevo rut del cliente
  try {
    const auto = await Auto.findOne({ where: { matricula: req.params.matricula } });
    if (!auto) {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }

    // Guardar el historial
    await HistorialPropietario.create({
      auto_matricula: auto.matricula, // Utilizando matrícula como referencia
      cliente_rut: cliente_rut
    });

    // Actualizar el auto
    auto.cliente_actual = cliente_rut; // Asignar el nuevo cliente
    await auto.save();

    res.status(200).json(auto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el auto' });
  }
});

module.exports = router;