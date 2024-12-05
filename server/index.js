const express = require('express');
const app = express();
const { sequelize } = require('./models');
const userRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/auth');
const ordenesDeTrabajoRoutes = require('./routes/ordenesDeTrabajoRoutes');
const autosRoutes = require('./routes/autosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const historialRoutes = require('./routes/historialPropietarioRoutes'); 
const proveedoresRoutes = require('./routes/proveedoresRoutes');
const PersonalRoutes = require('./routes/PersonalRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const HistorialOrdenes = require('./routes/HistorialOrdenes'); 
const deudoresRoutes = require('./routes/deudoresRoutes');
const accountpayables = require('./routes/accountpayableRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');


const cors = require('cors');

app.use(cors());
app.use(express.json()); 

// Aquí tengo las rutas. 
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ordenes-de-trabajo', ordenesDeTrabajoRoutes);
app.use('/autos', autosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/historial-propietario', historialRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/personal', PersonalRoutes);
app.use('/reservas', reservasRoutes);
app.use('/historial-ordenes', HistorialOrdenes);
app.use('/deudores', deudoresRoutes);
//app.use('/proveedores', suppliersRoutes);
app.use('/account-payable', accountpayables);
app.use('/inventario', inventarioRoutes);

// Sincronización de la base de datos y inicio del servidor
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized');
    app.listen(3001, () => {
      console.log('Server running on port 3001');
    });
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });
