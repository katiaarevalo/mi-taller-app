'use strict';

module.exports = (sequelize, DataTypes) => {
  const Personal = sequelize.define('Personal', {
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
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9\s+()-]*$/, // Validación de número telefónico
          msg: 'El telefono debe contener solo dígitos y ciertos caracteres especiales.'
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
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false, // Cargo es obligatorio
      validate: {
        notEmpty: {
          msg: 'El cargo no puede estar vacío.'
        }
      }
    },
    
  }, {
    tableName: 'Personal',
    timestamps: false
  });

  

  return Personal;
}
