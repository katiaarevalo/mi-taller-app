const express = require('express');
const router = express.Router();
const db = require('../models'); 
const { verifyToken } = require('../middleware/authMiddleware'); 


// Middleware en todas las rutas
router.use(verifyToken);

// -- CREAR PERSONAL -- //
router.post('/', async (req, res) => {
  try {
    const newPersonal = await db.Personal.create(req.body);
    res.status(201).json(newPersonal);
  } catch (error) {
    console.error('Error al crear personal:', error);
    res.status(500).json({ error: 'Error al crear personal' });
  }
});

// -- OBTENER TODO EL PERSONAL -- //
router.get('/', async (req, res) => {
  try {
    const personal = await db.Personal.findAll();
    res.status(200).json(personal);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ error: 'Error al obtener personal' });
  }
});

// -- OBTENER PERSONAL POR CÉDULA -- //
router.get('/:rut', async (req, res) => {
  try {
    const personal = await db.Personal.findOne({ where: { rut: req.params.rut } });
    if (!personal) return res.status(404).json({ error: 'Personal no encontrado' });
    res.status(200).json(personal);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ error: 'Error al obtener personal' });
  }
});

// -- MODIFICAR PERSONAL -- //
router.put('/:rut', async (req, res) => {
  try {
    const [updated] = await db.Personal.update(req.body, {
      where: { rut: req.params.rut }
    });
    if (!updated) return res.status(404).json({ error: 'Personal no encontrado' });
    const updatedPersonal = await db.Personal.findOne({ where: { rut: req.params.rut } });
    res.status(200).json(updatedPersonal);
  } catch (error) {
    console.error('Error al actualizar personal:', error);
    res.status(500).json({ error: 'Error al actualizar personal' });
  }
});

// -- BUSCAR PERSONAL POR CÉDULA -- //
router.get('/personal/search', async (req, res) => {
  const { rut } = req.query; // Cédula desde la query
  try {
    const personal = await db.Personal.findAll({
      where: {
        rut: {
          [Op.like]: `%${rut}%` // Coincidencias que contengan la cédula
        }
      },
      attributes: ['rut', 'nombre'] // Devolver solo la cédula y el nombre
    });
    res.status(200).json(personal);
  } catch (error) {
    console.error('Error al buscar personal:', error);
    res.status(500).json({ error: 'Error al buscar personal' });
  }
});

// -- ELIMINAR PERSONAL -- //
router.delete('/:rut', async (req, res) => {
  try {
    const personalrut = req.params.rut;

    const deleted = await db.Personal.destroy({ where: { rut: personalrut } });
    if (!deleted) return res.status(404).json({ error: 'Personal no encontrado' });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar personal:', error);
    res.status(500).json({ error: 'Error al eliminar personal' });
  }
});

module.exports = router;
