
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
        allowNull: true // Asegúrate de que este campo pueda ser nulo si es necesario
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: true // Asegúrate de que este campo pueda ser nulo si es necesario
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true // Asegúrate de que este campo pueda ser nulo si es necesario
      }
    }, {
      tableName: 'Clientes',
      timestamps: false
    });
  
    // Definir asociaciones si es necesario
    Cliente.associate = (models) => {
      // Ejemplo de asociación: Un cliente puede tener muchos autos
      Cliente.hasMany(models.Auto, { foreignKey: 'cliente_rut', sourceKey: 'rut' });
    };
  
    return Cliente;
  };