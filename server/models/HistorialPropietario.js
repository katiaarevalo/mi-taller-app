'use strict';
module.exports = (sequelize, DataTypes) => {
  const HistorialPropietario = sequelize.define('HistorialPropietario', {
    auto_matricula: {
      type: DataTypes.STRING,
      allowNull: false, // No puede ser nulo, siempre debe hacer referencia a un auto
      references: {
        model: 'Autos',
        key: 'matricula'
      }
    },
    cliente_rut: {
      type: DataTypes.STRING,
      allowNull: false, // No puede ser nulo, siempre debe hacer referencia a un cliente
      references: {
        model: 'Clientes',
        key: 'rut'
      }
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false, // Fecha obligatoria
      defaultValue: DataTypes.NOW // Valor por defecto: fecha actual
    }
  }, {
    tableName: 'HistorialPropietarios',
    timestamps: false // Desactivar timestamps
  });

  // Definir asociaciones
  HistorialPropietario.associate = (models) => {
    // Relación con Auto (muchos historial -> un auto)
    HistorialPropietario.belongsTo(models.Auto, { foreignKey: 'auto_matricula', targetKey: 'matricula' });
    // Relación con Cliente (muchos historial -> un cliente)
    HistorialPropietario.belongsTo(models.Cliente, { foreignKey: 'cliente_rut', targetKey: 'rut' });
  };

  return HistorialPropietario;
};