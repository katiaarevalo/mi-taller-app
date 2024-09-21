'use strict';
module.exports = (sequelize, DataTypes) => {
  const HistorialPropietario = sequelize.define('HistorialPropietario', {
    auto_matricula: { // Cambia el nombre del campo para que sea más claro
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Autos', // Nombre de la tabla de autos
        key: 'matricula' // 'matricula'
      }
    },
    cliente_rut: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Clientes', // Nombre de la tabla de clientes
        key: 'rut' // Asegúrate de que esta sea la clave primaria de Clientes
      }
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Establece la fecha actual por defecto
    }
  }, {
    tableName: 'HistorialPropietarios',
    timestamps: false
  });

  // Relaciones
  HistorialPropietario.associate = (models) => {
    HistorialPropietario.belongsTo(models.Auto, { foreignKey: 'auto_matricula', targetKey: 'matricula' });
    HistorialPropietario.belongsTo(models.Cliente, { foreignKey: 'cliente_rut' });
  };

  return HistorialPropietario;
};