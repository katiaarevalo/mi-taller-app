'use strict';
module.exports = (sequelize, DataTypes) => {
    const Reserva = sequelize.define('Reserva', {
        nombre: DataTypes.STRING,
        fecha: DataTypes.DATE,
        descripcion: DataTypes.TEXT
    }, {
        tableName: 'Reservas',
        timestamps: false
    });

    return Reserva;
};
