'use strict';

module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9\s+()-]*$/,
          msg: 'El número debe contener solo dígitos y ciertos caracteres especiales.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un correo válido.'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provides: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'suppliers',
    timestamps: false
  });

  return Supplier;
}