import axios from 'axios';

// Función para obtener clientes
export const fetchClientes = async (rut = '') => {
  try {
    const response = await axios.get(`http://localhost:3001/clientes?rut=${rut}`); // Ajusta la URL según tu backend
    return response.data; // Asegúrate de que el formato de la respuesta sea el esperado
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return []; // Retorna un arreglo vacío en caso de error
  }
};

// Función para actualizar un vehículo
export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await axios.put(`http://localhost:3001/autos/${vehicleId}`, vehicleData); // Ajusta la URL según tu backend
    return response.data; // Asegúrate de que el formato de la respuesta sea el esperado
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error; // Propaga el error para manejarlo más arriba si es necesario
  }
};

// Nueva función para obtener autos
export const fetchAutos = async (matricula = '') => {
  try {
    const response = await axios.get(`http://localhost:3001/autos?matricula=${matricula}`); // Ajusta la URL según tu backend
    return response.data; // Asegúrate de que el formato de la respuesta sea el esperado
  } catch (error) {
    console.error('Error fetching autos:', error);
    return []; // Retorna un arreglo vacío en caso de error
  }
};