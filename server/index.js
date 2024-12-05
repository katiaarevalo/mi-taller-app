const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Importar rutas
const userRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/auth');
const ordenesDeTrabajoRoutes = require('./routes/ordenesDeTrabajoRoutes');
const autosRoutes = require('./routes/autosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const historialRoutes = require('./routes/historialPropietarioRoutes'); 
const suppliersRoutes = require('./routes/suppliersRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');

// Middleware
app.use(cors());
app.use(express.json()); 

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ordenes-de-trabajo', ordenesDeTrabajoRoutes);
app.use('/autos', autosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/historial-propietario', historialRoutes);
app.use('/proveedores', suppliersRoutes);
app.use('/inventario', inventarioRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Sincronización de la base de datos y inicio del servidor
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized');
    const PORT = process.env.PORT || 3001; // Usar variable de entorno
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });