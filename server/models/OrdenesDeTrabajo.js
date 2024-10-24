'use strict';
module.exports = (sequelize, DataTypes) => {
    const OrdenDeTrabajo = sequelize.define('OrdenDeTrabajo', {
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true 
      },
      monto_total: {
        type: DataTypes.DECIMAL,
        allowNull: false 
      },
      monto_pagado: {
        type: DataTypes.DECIMAL,
        defaultValue: 0 // Valor por defecto es 0
      },
      fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: true 
      },
      fecha_termino: {
        type: DataTypes.DATE,
        allowNull: true 
      },
      matricula_vehiculo: {
        type: DataTypes.STRING,
        allowNull: false, // Obligatorio, siempre debe referirse a un vehículo
        references: {
          model: 'Autos', // Referencia al  Auto
          key: 'matricula'
        }
      },
      cliente_rut: {
        type: DataTypes.STRING,
        allowNull: false, // Obligatorio, siempre debe referirse a un cliente
        references: {
          model: 'Clientes', // Referencia Cliente
          key: 'rut'
        }
      }
    }, {
      tableName: 'OrdenesDeTrabajo',
      timestamps: false // Desactivar timestamps si no son necesarios
    });
  
    // relaciones
    OrdenDeTrabajo.associate = (models) => {
      // Relación con Auto (una orden de trabajo pertenece a un auto)
      OrdenDeTrabajo.belongsTo(models.Auto, {
        foreignKey: 'matricula_vehiculo', 
        targetKey: 'matricula' 
      });

      // Relación inversa: Un auto puede tener muchas órdenes de trabajo
      models.Auto.hasMany(OrdenDeTrabajo, {
        foreignKey: 'matricula_vehiculo', 
        sourceKey: 'matricula'
      });
  
      // Relación con Cliente (una orden de trabajo pertenece a un cliente)
      OrdenDeTrabajo.belongsTo(models.Cliente, {
        foreignKey: 'cliente_rut', 
        targetKey: 'rut' 
      });

      // Relación inversa: Un cliente puede tener muchas órdenes de trabajo
      models.Cliente.hasMany(OrdenDeTrabajo, {
        foreignKey: 'cliente_rut', 
        sourceKey: 'rut'
      });
    };
  
    return OrdenDeTrabajo;
};