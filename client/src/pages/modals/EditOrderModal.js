import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
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

const EditOrderModal = ({ open, onClose, orden }) => {
  const [formData, setFormData] = useState({
    matricula_vehiculo: '',
    fecha_inicio: '',
    fecha_termino: '',
    monto_total: '',
    monto_pagado: '',
    descripcion: '' // Agregamos la descripción
  });

  useEffect(() => {
    if (orden) {
      setFormData({
        matricula_vehiculo: orden.matricula_vehiculo || '',
        fecha_inicio: orden.fecha_inicio ? formatToUTC(orden.fecha_inicio) : '',
        fecha_termino: orden.fecha_termino ? formatToUTC(orden.fecha_termino) : '',
        monto_total: orden.monto_total || '',
        monto_pagado: orden.monto_pagado || '',
        descripcion: orden.descripcion || '' // Seteamos la descripción aquí
      });
    }
  }, [orden]);

  const formatToUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/ordenes-de-trabajo/${orden.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Editar Orden de Trabajo</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="matricula_vehiculo"
            label="Matrícula del Vehículo"
            variant="outlined"
            value={formData.matricula_vehiculo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled 
          />
          <TextField
            name="fecha_inicio"
            label="Fecha de Inicio"
            variant="outlined"
            type="date"
            value={formData.fecha_inicio}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="fecha_termino"
            label="Fecha de Término"
            variant="outlined"
            type="date"
            value={formData.fecha_termino}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="monto_total"
            label="Monto Total"
            variant="outlined"
            type="number"
            value={formData.monto_total}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="monto_pagado"
            label="Monto Pagado"
            variant="outlined"
            type="number"
            value={formData.monto_pagado}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {/* Campo para la descripción */}
          <TextField
            name="descripcion"
            label="Descripción"
            variant="outlined"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
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

export default EditOrderModal;
