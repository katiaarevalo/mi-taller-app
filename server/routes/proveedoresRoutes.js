const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware en todas las rutas.
router.use(verifyToken);

// -- CREAR UN PROVEEDOR -- //
router.post('/', async (req, res) => {
  try {
    const newProveedor = await db.Proveedor.create(req.body);
    res.status(201).json(newProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

// -- OBTENER TODOS LOS PROVEEDORES -- //
router.get('/', async (req, res) => {
  try {
    const proveedores = await db.Proveedor.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// -- OBTENER UN PROVEEDOR SEGÚN EL NOMBRE DE LA EMPRESA O POR PRODUCTO QUE PROVEE -- //
router.get('/:company', async (req, res) => {
  try {
    const proveedor = await db.Proveedor.findOne({ where: { company: req.params.company } });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// -- ACTUALIZAR UN PROVEEDOR POR NOMBRE DE EMPRESA (PROTEGIDO) -- //
router.put('/:company', async (req, res) => {
  try {
    const [updated] = await db.Proveedor.update(req.body, {
      where: { company: req.params.company }
    });
    if (!updated) return res.status(404).json({ error: 'Proveedor no encontrado' });
    const updatedProveedor = await db.Proveedor.findOne({ where: { company: req.params.company } });
    res.status(200).json(updatedProveedor);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

// -- ELIMINAR UN PROVEEDOR POR NOMBRE DE EMPRESA (PROTEGIDO) -- //
router.delete('/:company', async (req, res) => {
  try {
    const deleted = await db.Proveedor.destroy({ where: { company: req.params.company } });
    if (!deleted) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

module.exports = router;