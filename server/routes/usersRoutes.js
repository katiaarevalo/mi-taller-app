const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { User } = require('../models');

// -- CREAR UN USUARIO -- //
router.post('/', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const nuevoUsuario = await User.create({ username, password, email });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// -- OBTENER TODOS LOS USUARIOS (EXCLUYENDO CONTRASEÑA) --//
router.get('/', verifyToken, async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: { exclude: ['password'] } // - la contraseña
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// -- OBTENER UN USUARIO POR NOMBRE DE USUARIO -- //
router.get('/:username', verifyToken, async (req, res) => {
  try {
    const usuario = await User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ['password'] } // - la contraseña
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// -- ACTUALIZAR UN USUARIO POR NOMBRE DE USUARIO (PROTEGIDO) -- //
router.put('/:username', verifyToken, async (req, res) => {
  try {
    const usuario = await User.findOne({ where: { username: req.params.username } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.update(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// -- ELIMINAR UN USUARIO POR NOMBRE DE USUARIO (PROTEGIDO) -- //
router.delete('/:username', verifyToken, async (req, res) => {
  try {
    const usuario = await User.findOne({ where: { username: req.params.username } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;