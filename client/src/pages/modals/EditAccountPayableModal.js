import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


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

const EditAccountPayableModal = ({ open, onClose, AccountData}) => {


  const [Services, setServicio] = useState(''); 
  const [Company, setEmpresa] = useState(''); 
  const [Deadline, setFechaLimite] = useState(''); 
  const [Amount, setMonto] = useState(''); 
  const [State, setEstado] = useState('');  
  const [Today, setToday]=useState('');
 

  // -- ACTUALIZAR FORMULARIO -- //

  useEffect(() => {
    if (AccountData) {
      
      setServicio(AccountData.Services);
      setEmpresa(AccountData.Company);
      setFechaLimite(AccountData.Deadline);
      setMonto(AccountData.Amount);
      setEstado(AccountData.State);
      var f = new Date();
      setToday(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
    }
  }, [AccountData]);






  // -- ACTUALIZAR DATOS DE CUENTA -- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    
  

    try {
      const token = localStorage.getItem('token');


      await axios.put(`http://localhost:3001/account-payable/${AccountData.id}`, {
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
        title: 'Cuenta modificada con éxito',
        text: 'La cuenta ha sido modificada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al modificar la cuenta:', error);
      onClose(); // Cierra el modal
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al modificar la cuenta.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    
  };




  const handleChange = (event) => {
    setEstado(event.target.value)
  };

  const today = new Date().toISOString().split('T')[0];
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Modificar cuenta</Typography>
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
          <Select
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
              Modificar
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

export default EditAccountPayableModal;