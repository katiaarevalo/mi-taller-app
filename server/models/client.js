// module.exports = (sequelize, DataTypes) => {
//     const client = sequelize.define('client', {
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       address: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       phone: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       mail: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       matricula: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     }, {
//       tableName: 'client_detail', // Opcional: especifica el nombre de la tabla si es diferente
//       timestamps: false,        // Opcional: desactiva createdAt y updatedAt si no los usas
//     });
  
//     return client;
//   };