'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
      rut: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true // RUT debe ser único
      },
      nombre: {
          type: DataTypes.STRING,
          allowNull: false 
      },
      direccion: {
          type: DataTypes.STRING,
          allowNull: true 
      },
      numero: {
          type: DataTypes.STRING,
          allowNull: true, 
          validate: {
              is: {
                  args: /^[0-9\s+()-]*$/, // Validación de número telefónico
                  msg: 'El número debe contener solo dígitos y ciertos caracteres especiales.'
              }
          }
      },
      correo: {
          type: DataTypes.STRING,
          allowNull: true, 
          validate: {
              isEmail: {
                  msg: 'Debe ser un correo válido.'
              }
          }
      }
  }, {
      tableName: 'Clientes',
      timestamps: false 
  });

  Cliente.associate = (models) => {
      // Un cliente puede tener muchos autos.
      Cliente.hasMany(models.Auto, { foreignKey: 'cliente_actual', sourceKey: 'rut' });
      
      // Un cliente puede tener muchos registros en el historial de propietarios.
      Cliente.hasMany(models.HistorialPropietario, { foreignKey: 'cliente_rut', sourceKey: 'rut' });
  };

  return Cliente;
};