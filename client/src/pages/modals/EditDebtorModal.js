import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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

const EditDebtorModal = ({ open, onClose, debtor }) => {
  const [formData, setFormData] = useState({
    id: '',
    cliente_rut: '',
    monto_deuda: '',
    fecha_vencimiento: '',
    estado: ''
  });

  const [montoDeudaError, setMontoDeudaError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (debtor) {
      setFormData(debtor); // Rellena el formulario con los datos del deudor seleccionado
    }
  }, [debtor]);

  // -- MANEJAR CAMBIOS EN LOS INPUTS -- //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validación del monto de deuda
    if (name === 'monto_deuda' && value < 0) {
      setMontoDeudaError('El monto de deuda no puede ser negativo');
    } else {
      setMontoDeudaError('');
    }
  };

  // -- ACTUALIZAR DEUDOR -- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos y monto de deuda negativo
    if (!formData.monto_deuda || !formData.fecha_vencimiento || !formData.estado) {
      setErrorMessage('Todos los campos son obligatorios');
      setAlertOpen(true);
      return;
    }

    if (formData.monto_deuda < 0) {
      setMontoDeudaError('El monto de deuda no puede ser negativo');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/deudores/${formData.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        title: 'Deudor editado',
        text: 'El deudor ha sido editado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el deudor:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al editar el deudor.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      onClose(); // Cierra el modal
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false); // Cerrar alerta
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Editar datos del deudor</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="cliente_rut"
            label="Rut"
            variant="outlined"
            value={formData.cliente_rut}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled 
          />
          <TextField
            name="monto_deuda"
            label="Monto a deber"
            variant="outlined"
            value={formData.monto_deuda}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!montoDeudaError} // Muestra el error si existe
            helperText={montoDeudaError || "Por favor ingrese un monto válido"}
          />
          <TextField
            name="fecha_vencimiento"
            label="Fecha de vencimiento"
            type="date"
            value={formData.fecha_vencimiento}
            onChange={handleChange}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: '8px' }}
            required
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              label="Estado"
              required
            >
              <MenuItem value="Por Pagar">Por Pagar</MenuItem>
              <MenuItem value="Pagado">Pagado</MenuItem>
            </Select>
          </FormControl>
          
          {errorMessage && (
            <Snackbar
              open={alertOpen}
              autoHideDuration={3000}
              onClose={handleAlertClose}
              message={errorMessage}
            />
          )}

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

export default EditDebtorModal;