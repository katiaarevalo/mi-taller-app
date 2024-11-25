const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');

// -- CREAR UN PROVEEDOR -- //
router.post('/', async (req, res) => {
  try {
    const { company, name, phone, email, address, provides } = req.body;
    const nuevoProveedor = await db.create({ company, name, phone, email, address, provides });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

// -- OBTENER TODOS LOS PROVEEDORES -- //
router.get('/', verifyToken, async (req, res) => {
  try {
    const proveedores = await db.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// -- OBTENER UN PROVEEDOR SEGÚN EL NOMBRE DE LA EMPRESA O POR PRODUCTO QUE PROVEE -- //
router.get('/:company', verifyToken, async (req, res) => {
  try {
    const proveedor = await db.findOne({ where: { company: req.params.company } });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// -- ACTUALIZAR UN PROVEEDOR POR NOMBRE DE EMPRESA (PROTEGIDO) -- //
router.put('/:company', verifyToken, async (req, res) => {
  try {
    const proveedor = await db.findOne({ where: { company: req.params.company } });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    await proveedor.update(req.body);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

// -- ELIMINAR UN PROVEEDOR POR NOMBRE DE EMPRESA (PROTEGIDO) -- //
router.delete('/:company', verifyToken, async (req, res) => {
  try {
    const proveedor = await db.findOne({ where: { company: req.params.company } });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    await proveedor.destroy();
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

module.exports = router;