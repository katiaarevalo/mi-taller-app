import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { validateRut } from '../../helpers/validateRut';
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

const PersonalFormModal = ({ open, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [rutError, setRutError] = useState(false);

  // -- AGREGAR CLIENTE -- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el RUT antes de enviar...
    if (!validateRut(rut)) {
      setRutError(true);
      return; // se detiene el envío si el RUT es inválido.
    } else {
      setRutError(false);
    }

    // Formatear el RUT (asegurarse de que tenga el guion)
    //const formattedRut = rut.trim().replace(/[^0-9kK]/g, ''); // Quitar cualquier carácter no numérico
    //const rutWithDash = formattedRut.slice(0, -1) + '-' + formattedRut.slice(-1).toUpperCase(); // Añadir el guion antes del dígito verificador

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/personal', {
        nombre,
        rut,
        cargo,
        telefono,
        correo,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Restablecer los datos del formulario
      setNombre('');
      setRut('');
      setCargo('');
      setTelefono('');
      setCorreo('');
      onClose(); // Cerrar el modal

      Swal.fire({
        title: 'Personal agregado',
        text: 'El registro del personal se completó exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al agregar personal:', error);
      onClose(); // Cerrar el modal
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrar el personal.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Registro de nuevo personal</Typography>
        <form onSubmit={handleSubmit}>
        <TextField
            fullWidth
            label="RUT"
            variant="outlined"
            margin="normal"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required 
            error={rutError}
            helperText={rutError ? "RUT inválido" : ""}
          />
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            margin="normal"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))} // Permitir solo números
            required
          />
          <TextField
            fullWidth
            label="Correo"
            variant="outlined"
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            type="email"
            required
          />
          <TextField
            fullWidth
            label="Cargo"
            variant="outlined"
            margin="normal"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
          />
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Agregar
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

export default PersonalFormModal;
