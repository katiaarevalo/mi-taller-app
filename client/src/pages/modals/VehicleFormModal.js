import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import axios from 'axios';
import {validarMatricula} from '../../helpers/validateMatricula'; 
import Swal from 'sweetalert2';

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

  const [clientes, setClientes] = useState([]); 
  const [inputValue, setInputValue] = useState(''); 
  const [errorMatricula, setErrorMatricula] = useState(''); // Para manejar errores de matrícula

  useEffect(() => {
    // -- OBTENER CLIENTES -- //
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:3001/clientes', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setClientes(response.data); 
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    if (open) {
      fetchClientes(); // Carga los clientes solo si el modal está abierto
      setFormData({ matricula: '', color: '', descripcion: '', cliente_actual: '' }); // Resetea el formulario
      setErrorMatricula(''); // Resetea el error de matrícula
    }
  }, [open]);

  // -- ACTUALIZAR FORMULARIO -- //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -- CREAR VEHÍCULO -- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar matrícula antes de enviar
    if (!validarMatricula(formData.matricula)) {
      setErrorMatricula('La matrícula no tiene un formato válido.');
      return; // Evitar envío si la matrícula es incorrecta
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/autos', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose(); // Cierra el modal
      Swal.fire({
        title: 'Vehículo añadido',
        text: 'El vehículo ha sido añadido exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al añadir el vehículo:', error);
      onClose(); // Cierra el modal
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al añadir el vehículo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Añadir nuevo vehículo</Typography>
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
            error={!!errorMatricula} // Muestra el error si es verdadero
            helperText={errorMatricula || "Formato antiguo: AA 1234. Formato moderno: BB.CC.12"}  // Mensaje de error
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
          {/* -- AUTOCOMPLETE PARA SUGERENCIAS Y AUTOCOMPLETADO */}
          <Autocomplete
            options={clientes}
            getOptionLabel={(option) => `${option.rut} - ${option.nombre}`} 
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
                label="RUT cliente"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
            )}
          />
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
              Añadir
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onClose} 
              sx={{ textTransform: 'none' }} 
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