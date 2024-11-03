import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

// ESTILO DE MODAL.
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: '90%',
  maxHeight: '650px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto',
};

// Estilo de sección.
const sectionStyle = {
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f5f5',
  padding: '10px',
  marginBottom: '10px',
};

// Estilo
const sectionHeaderStyle = {
  backgroundColor: '#00a6ce',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px 4px 0 0',
  marginBottom: '10px',
};

// Componente funcional OrderFormModal
const OrderFormModal = ({ open, onClose, orderId }) => {
  const [clientes, setClientes] = useState([]); // Lista de clientes.
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]); // Sugerencias de clientes.
  const [vehiculos, setVehiculos] = useState([]); // Lista de vehículos del cliente.
  const [orden, setOrden] = useState({
    descripcion: '',
    monto_total: '',
    monto_pagado: '',
    fecha_inicio: '',
    fecha_termino: '',
    matricula_vehiculo: '',
    cliente_rut: '',
    cliente_nombre: ''
  });
  const [alertOpen, setAlertOpen] = useState(false); 
  const [errorFormat, setErrorFormat] = useState('');
  const [montoErrorOpen, setMontoErrorOpen] = useState(false);
  const [dateErrorOpen, setDateErrorOpen] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/clientes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    if (open) {
      fetchClientes();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrden(prev => ({ ...prev, [name]: value }));

    // Filtrar clientes según el RUT ingresado
    if (name === 'cliente_rut') {
      if (value.length > 0) {
        const filteredClientes = clientes.filter(cliente => cliente.rut.includes(value));
        setSugerenciasClientes(filteredClientes);
      } else {
        setSugerenciasClientes([]);
      }
    }

    // Validación para monto_total y monto_pagado
    if ((name === 'monto_total' || name === 'monto_pagado') && value < 0) {
      setErrorFormat('Formato incorrecto'); // Mostrar error de formato
    } else {
      setErrorFormat(''); // Limpiar mensaje de error
    }
  };


  const handleClienteSuggestionClick = (cliente) => {
    setOrden(prev => ({
      ...prev,
      cliente_rut: cliente.rut,
      cliente_nombre: cliente.nombre,
    }));
    setSugerenciasClientes([]);
    fetchVehiculos(cliente.rut); // Obtener vehículos del cliente seleccionado
  };

  const fetchVehiculos = async (rut) => {
    try {
      const response = await axios.get(`http://localhost:3001/autos/cliente/${rut}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Vehículos obtenidos:', response.data);
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  };

  const handleVehiculoChange = (event) => {
    const selectedMatricula = event.target.value;
    setOrden(prev => ({
      ...prev,
      matricula_vehiculo: selectedMatricula,
    }));
  };

  const handleSubmit = async () => {
    // Validar campos requeridos
  if (!orden.cliente_rut || !orden.descripcion || !orden.fecha_inicio || !orden.fecha_termino || !orden.matricula_vehiculo || !orden.monto_total || !orden.monto_pagado) {
      setAlertOpen(true); // Mostrar alerta de campos faltantes
      return;
    }

    // Validar que los montos no sean negativos
  if (orden.monto_total < 0 || orden.monto_pagado < 0) {
    setErrorFormat('Formato incorrecto'); // Mostrar error de formato
    return;
  }



  // Verificar que el monto pagado no sea mayor que el monto total
  if (Number(orden.monto_pagado) > Number(orden.monto_total)) {
    setMontoErrorOpen(true); // Mostrar alerta de monto pagado mayor
    return;
  }

  // Validar que la fecha de inicio no sea posterior a la fecha de término
  if (new Date(orden.fecha_inicio) > new Date(orden.fecha_termino)) {
    setDateErrorOpen(true); // Mostrar alerta de fecha inválida
    return;
  }

    try {
      console.log('Orden:', orden);
      const response = await axios.post('http://localhost:3001/ordenes-de-trabajo', orden, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Orden guardada:', response.data);
      limpiarFormulario();
      onClose(); // Cerrar el modal después de guardar
      Swal.fire({
        title: 'Orden de trabajo creada',
        text: 'La orden de trabajo ha sido creada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al crear la orden de trabajo:', error);
      onClose(); // Cerrar el modal en caso de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la orden de trabajo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const limpiarFormulario = () => {
    setOrden({
      descripcion: '',
      monto_total: '',
      monto_pagado: '',
      fecha_inicio: '',
      fecha_termino: '',
      matricula_vehiculo: '',
      cliente_rut: '',
      cliente_nombre: ''
    });
  
  };

  const handleAlertClose = () => {
    setAlertOpen(false); // Cerrar alerta
  };

  const handleMontoErrorClose = () => {
    setMontoErrorOpen(false); // Cerrar alerta de monto pagado mayor
  };

  const handleDateErrorClose = () => {
    setDateErrorOpen(false); // Cerrar alerta de fecha inválida
  };

  return (
    <Modal open={open} onClose={() => { limpiarFormulario(); onClose(); }}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ backgroundColor: '#1976d2', color: 'white', padding: '10px' }}>
          Orden de trabajo
        </Typography>

        <Grid container spacing={1}>
          {/* --- SECCIÓN ORDEN DE TRABAJO --- */}
          <Grid item xs={12}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Datos de orden de trabajo
              </Typography>
              <Grid container spacing={0.5}>
                {/* Primera fila: Rut Cliente y Fecha de Inicio */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="RUT cliente"
                    name="cliente_rut"
                    value={orden.cliente_rut}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '8px' }}
                  />
                  {/* Mostrar sugerencias de clientes */}
                  {sugerenciasClientes.length > 0 && (
                    <List sx={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
                      {sugerenciasClientes.map(cliente => (
                        <ListItem button key={cliente.rut} onClick={() => handleClienteSuggestionClick(cliente)}>
                          <ListItemText primary={cliente.rut} secondary={cliente.nombre} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de inicio"
                    name="fecha_inicio"
                    type="date"
                    value={orden.fecha_inicio}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '8px' }}
                  />
                </Grid>

                {/* Segunda fila: Nombre Cliente y Fecha de Término */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre cliente"
                    name="cliente_nombre"
                    value={orden.cliente_nombre}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '8px', marginTop: '0px' }}
                    InputProps={{
                      readOnly: true, // El campo de nombre es solo de lectura
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de término"
                    name="fecha_termino"
                    type="date"
                    value={orden.fecha_termino}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '8px' }}
                  />
                </Grid>

                {/* Tercera fila: Vehículo */}
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ marginBottom: '8px', marginTop: '10px' }}>
                    <InputLabel id="vehiculo-label" sx={{ position: 'absolute', top: -8, padding: '0 4px' }} shrink>Vehículo</InputLabel>
                    <Select
                      value={orden.matricula_vehiculo}
                      onChange={handleVehiculoChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Sin selección' }}
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Selecciona un vehículo
                      </MenuItem>
                      {vehiculos.map((vehiculo) => (
                        <MenuItem key={vehiculo.matricula} value={vehiculo.matricula}>
                          {vehiculo.matricula} - {vehiculo.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Cuarta fila: Descripción */}
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={orden.descripcion}
                    onChange={handleInputChange}
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ marginBottom: '8px' }}
                  />
                </Grid>

                {/* Quinta fila: Monto Total */}
                <Grid item xs={12}>
                  <Grid item xs={4}>
                    <TextField
                      label="Monto total"
                      name="monto_total"
                      value={orden.monto_total}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                      sx={{ marginBottom: '8px' }}
                      error={!!errorFormat}
                      helperText={errorFormat && (orden.monto_total < 0 ? errorFormat : '')}
                    />
                  </Grid>
                </Grid>

                {/* Sexta fila: Monto Pagado */}
                <Grid item xs={12}>
                  <Grid item xs={4}>
                    <TextField
                      label="Monto pagado"
                      name="monto_pagado"
                      value={orden.monto_pagado}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                      sx={{ marginBottom: '8px' }}
                      error={!!errorFormat}
                      helperText={errorFormat && (orden.monto_pagado < 0 ? errorFormat : '')}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Botones centrados */}
          <Grid container justifyContent="center" spacing={2} sx={{ marginTop: '20px' }}>
            <Grid item>
              <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none' }}>
                Crear 
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none' }}>
                Cerrar 
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Alerta de campos faltantes */}
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          message="Faltan campos por completar."
        />
  
          {/* Alerta de monto pagado mayor */}
          <Snackbar
          open={montoErrorOpen}
          autoHideDuration={3000}
          onClose={handleMontoErrorClose}
          message="El monto pagado no puede ser mayor que el monto total"
          />

        {/* Snackbar de alerta para fecha inválida */}
          <Snackbar
            open={dateErrorOpen}
            onClose={handleDateErrorClose}
            autoHideDuration={3000}
            message="La fecha de inicio no puede ser posterior a la fecha de término."
          />
      </Box>
    </Modal>
  );
};

export default OrderFormModal;