import React, { useState, useEffect } from 'react'; 
import { Modal, Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import axios from 'axios';
import moment from 'moment'; // Importa moment

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
    descripcion: ''
  });

  const [montoErrorOpen, setMontoErrorOpen] = useState(false);
  const [fechaErrorOpen, setFechaErrorOpen] = useState(false);

  useEffect(() => {
    if (orden) {
      setFormData({
        matricula_vehiculo: orden.matricula_vehiculo || '',
        fecha_inicio: orden.fecha_inicio ? moment(orden.fecha_inicio).subtract(1, 'days').format('YYYY-MM-DD') : '',
        fecha_termino: orden.fecha_termino ? moment(orden.fecha_termino).subtract(1, 'days').format('YYYY-MM-DD') : '',
        monto_total: orden.monto_total || '',
        monto_pagado: orden.monto_pagado || '',
        descripcion: orden.descripcion || ''
      });
    }
  }, [orden]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMontoErrorClose = () => setMontoErrorOpen(false);
  const handleFechaErrorClose = () => setFechaErrorOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del monto pagado
    if (parseFloat(formData.monto_pagado) > parseFloat(formData.monto_total)) {
      setMontoErrorOpen(true);
      return;
    }

    // Validación de fechas
    if (new Date(formData.fecha_inicio) > new Date(formData.fecha_termino)) {
      setFechaErrorOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/ordenes-de-trabajo/${orden.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose(); // Cierra el modal después de actualizar
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Orden de trabajo</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="matricula_vehiculo"
            label="Matrícula del vehículo"
            variant="outlined"
            value={formData.matricula_vehiculo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="fecha_inicio"
            label="Fecha de inicio"
            variant="outlined"
            type="date"
            value={formData.fecha_inicio}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="fecha_termino"
            label="Fecha de término"
            variant="outlined"
            type="date"
            value={formData.fecha_termino}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="monto_total"
            label="Monto total"
            variant="outlined"
            type="number"
            value={formData.monto_total}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="monto_pagado"
            label="Monto pagado"
            variant="outlined"
            type="number"
            value={formData.monto_pagado}
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
        {/* Alerta de monto pagado mayor */}
        <Snackbar
          open={montoErrorOpen}
          autoHideDuration={3000}
          onClose={handleMontoErrorClose}
          message="El monto pagado no puede ser mayor que el monto total"
        />
        {/* Alerta de fecha de inicio posterior a fecha de término */}
        <Snackbar
          open={fechaErrorOpen}
          autoHideDuration={3000}
          onClose={handleFechaErrorClose}
          message="La fecha de inicio no puede ser posterior a la fecha de término"
        />
      </Box>
    </Modal>
  );
};

export default EditOrderModal;

