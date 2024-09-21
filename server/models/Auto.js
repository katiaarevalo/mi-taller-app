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
        },
        cliente_actual: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Clientes', // Asegúrate de que este sea el nombre correcto de la tabla de clientes
                key: 'rut'
            }
        }
    }, {
        tableName: 'Autos',
        timestamps: false
    });

    // Definir asociaciones
    Auto.associate = (models) => {
      // Relación con Cliente
      Auto.belongsTo(models.Cliente, { foreignKey: 'cliente_actual', targetKey: 'rut' });
      models.Cliente.hasMany(Auto, { foreignKey: 'cliente_actual', sourceKey: 'rut' });
      Auto.hasMany(models.HistorialPropietario, { foreignKey: 'auto_matricula' });
    };


    return Auto;
};