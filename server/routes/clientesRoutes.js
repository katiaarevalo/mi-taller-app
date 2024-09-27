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

// -- BUSCAR CLIENTES POR RUT -- //
router.get('/clientes/search', async (req, res) => {
  const { rut } = req.query; // Obtenemos el RUT desde la query
  try {
    const clientes = await db.Cliente.findAll({
      where: {
        rut: {
          [Op.like]: `%${rut}%` // Busca coincidencias que contengan el RUT
        }
      },
      attributes: ['rut', 'nombre'] // Devuelve solo el RUT y el nombre
    });
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
});

// -- ELIMINAR UN CLIENTE -- //
router.delete('/:rut', async (req, res) => {
  try {
    const clienteRut = req.params.rut;

    // Verifica si el cliente está asociado a alguna orden de trabajo
    const tieneOrden = await db.OrdenDeTrabajo.findOne({ where: { cliente_rut: clienteRut } });
    // Verifica si el cliente está asociado a algún auto
    const tieneAuto = await db.Auto.findOne({ where: { cliente_actual: clienteRut } });

    if (tieneOrden || tieneAuto) {
      return res.status(400).json({ message: 'No se puede eliminar el cliente porque está asociado a una orden de trabajo o a un auto.' });
    }

    const deleted = await db.Cliente.destroy({ where: { rut: clienteRut } });
    if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;