// models/Inventario.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Inventario = sequelize.define('Inventario', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false, // Asegúrate de que el nombre del artículo sea único
            validate: {
                notEmpty: true, // No permite valores vacíos
                isNotNumeric(value) { // Validación personalizada para evitar números
                    if (!isNaN(value)) {
                        throw new Error('El nombre no puede ser un número.');
                    }
                }
            }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Valor por defecto para cantidad
            validate: {
                min: 1, // La cantidad mínima permitida es 1
                isInt: true // Asegúrate de que sea un número entero
            }
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true // Puede ser nulo
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false, // No puede ser nulo
            validate: {
                notEmpty: true, // No permite valores vacíos
                isNotNumeric(value) { // Validación personalizada para evitar números
                    if (!isNaN(value)) {
                        throw new Error('La categoría no puede ser un número.');
                    }
                }
            }
        }
    }, {
        tableName: 'Inventarios', // Nombre de la tabla en la base de datos
        timestamps: true // Si deseas mantener un registro de las fechas de creación y actualización
    });

    return Inventario;
};
