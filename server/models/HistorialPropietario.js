module.exports = (sequelize, DataTypes) => {
  const HistorialPropietario = sequelize.define('HistorialPropietario', {
    auto_matricula: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Autos', 
        key: 'matricula'
      }
    },
    cliente_rut: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Clientes', 
        key: 'rut' 
      }
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW 
    }
  }, {
    tableName: 'HistorialPropietarios',
    timestamps: false
  });

  // Relaciones
  HistorialPropietario.associate = (models) => {
    // Un historial de propietario pertenece a un auto
    HistorialPropietario.belongsTo(models.Auto, { foreignKey: 'auto_matricula', targetKey: 'matricula' });
    // Un historial de propietario pertenece a un cliente
    HistorialPropietario.belongsTo(models.Cliente, { foreignKey: 'cliente_rut', targetKey: 'rut' });
  };

  return HistorialPropietario;
};