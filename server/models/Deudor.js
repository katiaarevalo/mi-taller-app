'use strict'
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    const Deudor = sequelize.define('Deudor', {
        cliente_rut: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Clientes',
                key: 'rut'
            }
        },
        monto_deuda: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            get() {
                const fechaVencimiento = this.getDataValue('fecha_vencimiento');
                // Suma 1 día al mostrar la fecha
                return fechaVencimiento ? moment(fechaVencimiento).format('YYYY-MM-DD') : null;
            }
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'Deudores',
        timestamps: false
    });

    Deudor.associate = (models) => {
        // Un deudor pertenece a un cliente.
        Deudor.belongsTo(models.Cliente, { foreignKey: 'cliente_rut', targetKey: 'rut' });
    };

    return Deudor;
}