const express = require('express');
const app = express();
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cors = require('cors');

app.use(cors());
app.use(express.json()); 

// Aquí tengo las rutas. 
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

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