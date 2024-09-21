const express = require('express');
const router = express.Router();
const db = require('../models'); 
const { verifyToken } = require('../middleware/authMiddleware'); 

// Middleware en todas las rutas.
router.use(verifyToken);

// -- CREAR UN CLIENTE -- //
router.post('/', async (req, res) => {
  try {
    const newCliente = await db.Cliente.create(req.body);
    res.status(201).json(newCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// -- OBTENER TODOS LOS CLIENTES -- //
router.get('/', async (req, res) => {
  try {
    const clientes = await db.Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// -- OBTENER UN CLIENTE POR RUT -- //
router.get('/:rut', async (req, res) => {
  try {
    const cliente = await db.Cliente.findOne({ where: { rut: req.params.rut } });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// -- MODIFICAR UN CLIENTE -- //
router.put('/:rut', async (req, res) => {
  try {
    const [updated] = await db.Cliente.update(req.body, {
      where: { rut: req.params.rut }
    });
    if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
    const updatedCliente = await db.Cliente.findOne({ where: { rut: req.params.rut } });
    res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// -- ELIMINAR UN CLIENTE -- //
router.delete('/:rut', async (req, res) => {
  try {
    const deleted = await db.Cliente.destroy({
      where: { rut: req.params.rut }
    });
    if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;