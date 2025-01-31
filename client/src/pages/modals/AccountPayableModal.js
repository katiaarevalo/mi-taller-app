import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

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

const AccountPayableModal = ({ open, onClose }) => {
  const [Services, setServicio] = useState(''); 
  const [Company, setEmpresa] = useState(''); 
  const [Deadline, setFechaLimite] = useState(''); 
  const [Amount, setMonto] = useState(''); 
  const [State, setEstado] = useState('Por pagar'); // Inicializa con "Por pagar"

  // Llama a limpiarFormulario cada vez que el modal se abre
  useEffect(() => {
    if (open) {
      limpiarFormulario();
    }
  }, [open]);

  const limpiarFormulario = () => {
    setServicio('');
    setEmpresa('');
    setFechaLimite('');
    setMonto('');
    setEstado('Por pagar'); // Restablece también el estado
  };

  // -- CREAR CUENTA -- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (Amount < 0) {
        Swal.fire({
          title: 'Error',
          text: 'El monto debe ser mayor a 0.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      await axios.post('http://localhost:3001/account-payable', {
        Services,
        Company,
        Deadline,
        Amount,
        State,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onClose(); // Cierra el modal
      
      Swal.fire({
        title: 'Cuenta añadida',
        text: 'La cuenta ha sido añadida exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al añadir la cuenta:', error);
      onClose(); // Cierra el modal

      Swal.fire({
        title: 'Error',
        html: `Hubo un problema al añadir la cuenta.<br/> ${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleChange = (event) => {
    setEstado(event.target.value);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Añadir nueva cuenta</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="Service"
            label="Servicio"
            variant="outlined"
            value={Services}
            onChange={(e) => setServicio(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="Company"
            label="Compañía"
            variant="outlined"
            value={Company}
            onChange={(e) => setEmpresa(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="Amount"
            label="Monto"
            variant="outlined"
            value={Amount}
            onChange={(e) => setMonto(e.target.value)}
            fullWidth
            margin="normal"
            required
          />  
          <TextField
              label="Fecha límite"
              name="fecha"
              type="date"
              value={Deadline}
              onChange={(e) => setFechaLimite(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }} // Establecer la fecha mínima como hoy
          />
          <InputLabel id="demo-simple-select-label">Estado</InputLabel>
          <Select
              name="State"
              variant="outlined"
              value={State}
              label="Estado"
              onChange={handleChange}
          >
              <MenuItem value={"Por pagar"}>Por pagar</MenuItem>
              <MenuItem value={"Pagado"}>Pagado</MenuItem>
              <MenuItem value={"Atrasado"}>Atrasado</MenuItem>
          </Select>       
          
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

export default AccountPayableModal; 
