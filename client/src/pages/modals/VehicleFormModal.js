import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VehicleFormModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    matricula: '',
    color: '',
    descripcion: '',
    cliente_actual: ''
  });

  const [clientes, setClientes] = useState([]); // Estado para almacenar las sugerencias de clientes
  const [inputValue, setInputValue] = useState(''); // Estado para manejar lo que escribe el usuario

  useEffect(() => {
    // Cargar clientes al abrir el modal
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        const response = await axios.get('http://localhost:3001/clientes', {
          headers: { Authorization: `Bearer ${token}` } // Incluir el token en la cabecera
        });
        setClientes(response.data); // Asegúrate de que esto sea un array
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    if (open) {
      fetchClientes(); // Carga los clientes solo si el modal está abierto
      setFormData({ matricula: '', color: '', descripcion: '', cliente_actual: '' }); // Resetea el formulario
    }
  }, [open]);

  // Manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar el nuevo vehículo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/autos', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Crear nuevo vehículo</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="matricula"
            label="Matrícula"
            variant="outlined"
            value={formData.matricula}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="color"
            label="Color"
            variant="outlined"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="descripcion"
            label="Descripción"
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          {/* Componente Autocomplete para seleccionar un cliente existente */}
          <Autocomplete
            options={clientes}
            getOptionLabel={(option) => `${option.rut} - ${option.nombre}`} // Cambia según tu modelo de cliente
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                setFormData((prev) => ({ ...prev, cliente_actual: newValue.rut })); // Asigna el RUT seleccionado
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente Actual (RUT)"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
            )}
          />
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
              Crear
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onClose} // Cierra el modal
              sx={{ textTransform: 'none' }} // Evitar que el texto se convierta en mayúsculas
            >
              Cerrar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default VehicleFormModal;