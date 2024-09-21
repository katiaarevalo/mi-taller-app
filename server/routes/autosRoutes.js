const express = require('express');
const router = express.Router();
const db = require('../models'); 
const { verifyToken } = require('../middleware/authMiddleware');

// Aplico el middleware a todas las rutas. 
router.use(verifyToken);

// -- CREAR UN NUEVO AUTO -- // 
router.post('/', async (req, res) => {
  try {
    const newAuto = await db.Auto.create(req.body);
    res.status(201).json(newAuto);
  } catch (error) {
    console.error('Error al crear auto:', error);
    res.status(500).json({ error: 'Error al crear auto' });
  }
});

// -- OBTENER TODOS LOS AUTOS -- //
router.get('/', async (req, res) => {
  try {
    const autos = await db.Auto.findAll();
    res.status(200).json(autos);
  } catch (error) {
    console.error('Error al obtener autos:', error);
    res.status(500).json({ error: 'Error al obtener autos' });
  }
});

// -- OBTENER AUTO POR MATRICULA -- //
router.get('/:matricula', async (req, res) => {
  try {
    const auto = await db.Auto.findOne({ where: { matricula: req.params.matricula } });
    if (!auto) return res.status(404).json({ error: 'Auto no encontrado' });
    res.status(200).json(auto);
  } catch (error) {
    console.error('Error al obtener auto:', error);
    res.status(500).json({ error: 'Error al obtener auto' });
  }
});

// -- MODIFICAR UN AUTO -- //
router.put('/:matricula', async (req, res) => {
  try {
    const [updated] = await db.Auto.update(req.body, {
      where: { matricula: req.params.matricula }
    });
    if (!updated) return res.status(404).json({ error: 'Auto no encontrado' });
    const updatedAuto = await db.Auto.findOne({ where: { matricula: req.params.matricula } });
    res.status(200).json(updatedAuto);
  } catch (error) {
    console.error('Error al actualizar auto:', error);
    res.status(500).json({ error: 'Error al actualizar auto' });
  }
});

// -- ELIMINAR UN AUTO -- //
router.delete('/:matricula', async (req, res) => {
  try {
    const deleted = await db.Auto.destroy({
      where: { matricula: req.params.matricula }
    });
    if (!deleted) return res.status(404).json({ error: 'Auto no encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar auto:', error);
    res.status(500).json({ error: 'Error al eliminar auto' });
  }
});

module.exports = router;