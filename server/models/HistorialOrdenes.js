'use strict';
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    const HistorialOrdenes = sequelize.define('HistorialOrdenes', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true, // Asegura que el id sea autoincrementable
        },
        fecha_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false, // Es obligatorio proporcionar este valor
        },
        fecha_termino: {
            type: DataTypes.DATEONLY,
            allowNull: false, // También obligatorio
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true, // Puede ser nulo si no hay descripción
        },
        monto_total: {
            type: DataTypes.DECIMAL(10, 2), // Limitar la precisión
            allowNull: false, // Obligatorio
        },
        monto_pagado: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0, // Por defecto es 0
        },
        matricula_vehiculo: {
            type: DataTypes.STRING,
            allowNull: false, // Es obligatorio
        },
        cliente_rut: {
            type: DataTypes.STRING,
            allowNull: false, // Es obligatorio
        },
        fecha_eliminacion: {
          type: DataTypes.DATEONLY,
          allowNull: false, // Es obligatorio proporcionar este valor
      }

    }, {
        tableName: 'HistorialOrdenes',
        timestamps: false // Desactivar timestamps si no son necesarios
    });

    return HistorialOrdenes;
};

