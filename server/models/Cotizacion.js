'use strict';

const validarRUT = (rut) => {
  const [numeros, dv] = rut.split('-');
  const rutNumeros = numeros.replace(/\./g, ''); // Eliminar puntos
  let suma = 0;
  let multiplo = 2;

  for (let i = rutNumeros.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumeros[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1; // Cambia el múltiplo
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 10 ? 'K' : (resto === 11 ? '0' : resto.toString());
  
  return dvEsperado === dv.toUpperCase(); // Compara el dígito verificador
};

module.exports = (sequelize, DataTypes) => {
  const Cotizacion = sequelize.define('cotizacion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Esto permite que sea autoincremental
      primaryKey: true, // Esto establece 'id' como la clave primaria
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{1,8}-[0-9K]{1}$/,
          msg: 'RUT debe tener el formato correcto (ej: 12345678-9 o 12345678-K)',
        },
        isValid: (value) => {
          if (!validarRUT(value)) {
            throw new Error('RUT no válido');
          }
        }
      }
    },
    fecha: {
      type: DataTypes.DATE, // Define el tipo de dato como DATE
      allowNull: false, // Este campo es obligatorio
      validate: {
        isDate: true, // Verifica que el valor sea una fecha válida
      },
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipoVehiculo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'cotizaciones', // Asegúrate de que este sea el nombre correcto de la tabla
    timestamps: false,
  });

  return Cotizacion;
};
