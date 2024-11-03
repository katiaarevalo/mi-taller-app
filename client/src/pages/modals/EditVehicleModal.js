import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
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

const EditVehicleModal = ({ open, onClose, vehicle }) => {
  const [formData, setFormData] = useState({
    matricula: '',
    descripcion: '',
    color: '',
    cliente_actual: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle); // Rellena el formulario con los datos del vehículo seleccionado
    }
  }, [vehicle]);

  // -- MANEJAR CAMBIOS EN LOS INPUTS -- //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -- ACTUALIZAR VEHÍCULO -- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/autos/${formData.matricula}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        title: 'Vehículo editado',
        text: 'El vehículo ha sido editado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al editar el vehículo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      onClose(); // Cierra el modal
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Editar datos del vehículo</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="matricula"
            label="Matrícula"
            variant="outlined"
            value={formData.matricula}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled 
          />
          <TextField
            name="cliente_actual"
            label="Cliente actual (RUT)"
            variant="outlined"
            value={formData.cliente_actual}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled 
          />
          <TextField
            name="color"
            label="Color"
            variant="outlined"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="descripcion"
            label="Descripción"
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
              Guardar
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

export default EditVehicleModal;