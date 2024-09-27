const express = require('express');
const router = express.Router();
const db = require('../models'); 
const { verifyToken } = require('../middleware/authMiddleware');

// Aplico el middleware a todas las rutas. 
router.use(verifyToken);

// -- CREAR UN NUEVO AUTO -- // 
router.post('/', async (req, res) => {
  const { matricula, cliente_actual } = req.body; // Extraemos la matrícula y el cliente actual
  try {
    // Primero, creamos el nuevo auto
    const newAuto = await db.Auto.create(req.body);

    // Luego, registramos el historial del propietario
    await db.HistorialPropietario.create({
      auto_matricula: newAuto.matricula,
      cliente_rut: cliente_actual, // Usamos el cliente actual
      fecha_cambio: new Date() // Fecha actual
    });

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

// -- OBTENER HISTORIAL DE PROPIETARIOS POR MATRÍCULA -- //
router.get('/:matricula/historial', async (req, res) => {
  try {
    const historial = await db.HistorialPropietario.findAll({
      where: { auto_matricula: req.params.matricula },
      include: [{
        model: db.Cliente, // Incluir información del cliente
        attributes: ['rut', 'nombre'], // Cambia estos atributos según tu modelo
      }],
    });
    res.status(200).json(historial);
  } catch (error) {
    console.error('Error al obtener historial de propietarios:', error);
    res.status(500).json({ error: 'Error al obtener historial de propietarios' });
  }
});

// -- MODIFICAR UN AUTO -- //
router.put('/:matricula', async (req, res) => {
  const { cliente_actual } = req.body; // Extraemos el cliente actual si se proporciona
  try {
    const [updated] = await db.Auto.update(req.body, {
      where: { matricula: req.params.matricula }
    });
    
    if (!updated) return res.status(404).json({ error: 'Auto no encontrado' });

    // Si se proporciona un nuevo cliente actual, registramos el cambio en el historial
    if (cliente_actual) {
      await db.HistorialPropietario.create({
        auto_matricula: req.params.matricula,
        cliente_rut: cliente_actual,
        fecha_cambio: new Date()
      });
    }

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