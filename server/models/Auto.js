'use strict';
module.exports = (sequelize, DataTypes) => {
    const Auto = sequelize.define('Auto', {
      matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true // ¿Puede ser nulo? *Revisar
      }
    }, {
      tableName: 'Autos',
      timestamps: false
    });
  
    // Definir asociaciones
    Auto.associate = (models) => {
      // Relación con Cliente
      Auto.belongsTo(models.Cliente, { foreignKey: 'cliente_rut', targetKey: 'rut' });
      models.Cliente.hasMany(Auto, { foreignKey: 'cliente_rut', sourceKey: 'rut' });
    };
  
    return Auto;
  };