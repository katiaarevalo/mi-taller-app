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

const EditClientModal = ({ open, onClose, cliente }) => {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    direccion: '',
    numero: '',
    correo: ''
  });

  useEffect(() => {
    if (cliente) {
      setFormData(cliente); // Rellena el formulario con los datos del cliente seleccionado
    }
  }, [cliente]);

  // -- MANEJAR CAMBIOS EN LOS INPUTS -- //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -- ACTUALIZAR CLIENTE -- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/clientes/${formData.rut}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        title: 'Cliente editado',
        text: 'El cliente ha sido editado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      onClose();
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al editar el cliente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Editar datos de cliente</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="rut"
            label="RUT cliente"
            variant="outlined"
            value={formData.rut}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled 
          />
          <TextField
            name="nombre"
            label="Nombre"
            variant="outlined"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="direccion"
            label="Dirección"
            variant="outlined"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="numero"
            label="Número"
            variant="outlined"
            value={formData.numero}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="correo"
            label="Correo"
            variant="outlined"
            value={formData.correo}
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

export default EditClientModal;