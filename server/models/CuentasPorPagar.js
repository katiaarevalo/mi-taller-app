'use strict';

module.exports = (sequelize, DataTypes) => {
  const CuentasPorPagar = sequelize.define('CuentasPorPagar', {

    Services: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    State: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    tableName: 'AccountPayable',
    timestamps: false
  });

  return CuentasPorPagar;
}