'use strict';
const moment = require('moment');
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
            type: DataTypes.DATEONLY,
            allowNull: true,
            get() {
                const fechaInicio = this.getDataValue('fecha_inicio');
                return fechaInicio ? moment(fechaInicio).add(2, 'days').format('YYYY-MM-DD') : null;
            }
        },
        fecha_termino: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            get() {
                const fechaTermino = this.getDataValue('fecha_termino');
                return fechaTermino ? moment(fechaTermino).add(2, 'days').format('YYYY-MM-DD') : null;
            }
        },
        matricula_vehiculo: {
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
        }
    }, {
        tableName: 'OrdenesDeTrabajo',
        timestamps: false
    });

    // Hooks para validar las fechas
    OrdenDeTrabajo.addHook('beforeCreate', (orden) => {
        if (orden.fecha_inicio && orden.fecha_termino && moment(orden.fecha_inicio).isAfter(moment(orden.fecha_termino))) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha de término.');
        }
    });

    OrdenDeTrabajo.addHook('beforeUpdate', (orden) => {
        if (orden.fecha_inicio && orden.fecha_termino && moment(orden.fecha_inicio).isAfter(moment(orden.fecha_termino))) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha de término.');
        }
    });

    // Relaciones
    OrdenDeTrabajo.associate = (models) => {
        OrdenDeTrabajo.belongsTo(models.Auto, {
            foreignKey: 'matricula_vehiculo', 
            targetKey: 'matricula' 
        });

        models.Auto.hasMany(OrdenDeTrabajo, {
            foreignKey: 'matricula_vehiculo', 
            sourceKey: 'matricula'
        });

        OrdenDeTrabajo.belongsTo(models.Cliente, {
            foreignKey: 'cliente_rut', 
            targetKey: 'rut' 
        });

        models.Cliente.hasMany(OrdenDeTrabajo, {
            foreignKey: 'cliente_rut', 
            sourceKey: 'rut'
        });
    };

    return OrdenDeTrabajo;
};
