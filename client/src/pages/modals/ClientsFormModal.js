import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { validateRut } from '../../helpers/validateRut'; 

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

const ClientFormModal = ({ open, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [direccion, setDireccion] = useState('');
  const [numero, setNumero] = useState('');
  const [correo, setCorreo] = useState('');
  const [rutError, setRutError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el RUT antes de enviar
    if (!validateRut(rut)) {
      setRutError(true);
      return; // Detener el envío si el RUT es inválido
    } else {
      setRutError(false);
    }

    // Formatear el RUT (asegurarse de que tenga el guion)
    const formattedRut = rut.trim().replace(/[^0-9kK]/g, ''); // Quitar cualquier carácter no numérico
    const rutWithDash = formattedRut.slice(0, -1) + '-' + formattedRut.slice(-1).toUpperCase(); // Añadir el guion antes del dígito verificador

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/clientes', {
        nombre,
        rut: rutWithDash, // Enviar el RUT con el formato correcto
        direccion,
        numero,
        correo,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Restablecer los datos del formulario
      setNombre('');
      setRut('');
      setDireccion('');
      setNumero('');
      setCorreo('');
      setRutError(false); // Restablecer el error del RUT
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al agregar cliente:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Registro de nuevo cliente</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required // Campo obligatorio
          />
          <TextField
            fullWidth
            label="RUT"
            variant="outlined"
            margin="normal"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required // Campo obligatorio
            error={rutError}
            helperText={rutError ? "RUT inválido" : ""}
          />
          <TextField
            fullWidth
            label="Número"
            variant="outlined"
            margin="normal"
            value={numero}
            onChange={(e) => setNumero(e.target.value.replace(/[^0-9]/g, ''))} // Permitir solo números
            required // Campo obligatorio
          />
          <TextField
            fullWidth
            label="Correo"
            variant="outlined"
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            type="email"
            required // Campo obligatorio
          />
          <TextField
            fullWidth
            label="Dirección"
            variant="outlined"
            margin="normal"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              sx={{ textTransform: 'none' }} // Evitar que el texto se convierta en mayúsculas
            >
              Agregar
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onClose} // Llama a onClose para cerrar el modal
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

export default ClientFormModal;