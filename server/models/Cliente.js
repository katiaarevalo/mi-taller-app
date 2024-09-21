
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
      rut: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: true // ¿Puede ser nulo? *Revisar
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true // ¿Puede ser nulo? *Revisar
      }
    }, {
      tableName: 'Clientes',
      timestamps: false
    });
  
    // Relaciones de cliente...
    Cliente.associate = (models) => {
      //Un cliente puede tener muchos autos. 
      Cliente.hasMany(models.Auto, { foreignKey: 'cliente_actual', sourceKey: 'rut' });
    };
  
    return Cliente;
  };