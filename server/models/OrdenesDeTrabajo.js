module.exports = (sequelize, DataTypes) => {
    const OrdenDeTrabajo = sequelize.define('OrdenDeTrabajo', {
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      monto_total: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      monto_pagado: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
      },
      fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      fecha_termino: {
        type: DataTypes.DATE,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      matricula_vehiculo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cliente_rut: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'OrdenesDeTrabajo',
      timestamps: false
    });
  
    //  Definiciónd de relaciones
    OrdenDeTrabajo.associate = (models) => {
      // Relación con Auto...
      OrdenDeTrabajo.belongsTo(models.Auto, { foreignKey: 'matricula_vehiculo', targetKey: 'matricula' });
      models.Auto.hasMany(OrdenDeTrabajo, { foreignKey: 'matricula_vehiculo', sourceKey: 'matricula' });
  
      // Relación con Cliente...
      OrdenDeTrabajo.belongsTo(models.Cliente, { foreignKey: 'cliente_rut', targetKey: 'rut' });
      models.Cliente.hasMany(OrdenDeTrabajo, { foreignKey: 'cliente_rut', sourceKey: 'rut' });
    };
  
    return OrdenDeTrabajo;
  };