import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: '90%',
  maxHeight: '1000px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto',
};

const sectionStyle = {
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f5f5',
  padding: '10px',
  marginBottom: '10px',
};

const sectionHeaderStyle = {
  backgroundColor: '#00a6ce',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px 4px 0 0',
  marginBottom: '10px',
};

const OrderFormModal = ({ open, onClose, orderId }) => {
  const [clientes, setClientes] = useState([]);
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [sugerenciasAutos, setSugerenciasAutos] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    rut: '', nombre: '', direccion: '', numero: '', correo: ''
  });
  const [auto, setAuto] = useState({
    matricula: '', descripcion: '', color: '', cliente_actual: ''
  });
  const [orden, setOrden] = useState({
    descripcion: '', monto_total: '', monto_pagado: '',
    fecha_inicio: '', fecha_termino: '', matricula_vehiculo: '', cliente_rut: ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/clientes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    const fetchAutos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/autos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAutos(response.data);
      } catch (error) {
        console.error('Error al obtener autos:', error);
      }
    };

    if (open) {
      fetchClientes();
      fetchAutos();
    }
  }, [open]);

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));

    // Si el campo es RUT, actualizar sugerencias de clientes
    if (name === 'rut') {
      const filteredClientes = clientes.filter(cliente => cliente.rut.includes(value));
      setSugerenciasClientes(filteredClientes);
    }

    // Si el campo es matrícula, actualizar sugerencias de autos
    if (name === 'matricula') {
      const filteredAutos = autos.filter(auto => auto.matricula.includes(value));
      setSugerenciasAutos(filteredAutos);
    }
  };

  const handleSuggestionClickCliente = (cliente) => {
    setNuevoCliente({
      rut: cliente.rut,
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      numero: cliente.numero,
      correo: cliente.correo,
    });
    setSugerenciasClientes([]); // Limpiar sugerencias después de seleccionar
  };

  const handleSuggestionClickAuto = (auto) => {
    setAuto({
      matricula: auto.matricula,
      descripcion: auto.descripcion,
      color: auto.color,
      cliente_actual: auto.cliente_actual,
    });
    setSugerenciasAutos([]); // Limpiar sugerencias después de seleccionar
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    try {
      // Verificar si el cliente existe
      let clienteResponse = await fetch(`http://localhost:3001/clientes/${nuevoCliente.rut}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      let cliente;

      if (!clienteResponse.ok) {
        // Si no existe, crear el cliente
        cliente = await fetch('http://localhost:3001/clientes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoCliente),
        }).then(res => res.json());
      } else {
        cliente = await clienteResponse.json();
      }

      // Crear el auto
      await fetch('http://localhost:3001/autos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matricula: auto.matricula,
          descripcion: auto.descripcion,
          color: auto.color,
          cliente_actual: cliente.rut,
        }),
      });

      // Crear la orden de trabajo
      await fetch('http://localhost:3001/ordenes-de-trabajo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descripcion: orden.descripcion,
          monto_total: orden.monto_total,
          monto_pagado: orden.monto_pagado,
          fecha_inicio: orden.fecha_inicio,
          fecha_termino: orden.fecha_termino,
          matricula_vehiculo: auto.matricula,
          cliente_rut: cliente.rut,
        }),
      });

      // Cerrar el modal después de guardar
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  };

  const handleReset = () => {
    setNuevoCliente({
      rut: '', nombre: '', direccion: '', numero: '', correo: ''
    });
    setAuto({
      matricula: '', descripcion: '', color: '', cliente_actual: ''
    });
    setOrden({
      descripcion: '', monto_total: '', monto_pagado: '',
      fecha_inicio: '', fecha_termino: '', matricula_vehiculo: '', cliente_rut: ''
    });
    setSugerenciasClientes([]);
    setSugerenciasAutos([]);
  };

  const getInputStyle = (isReadOnly) => ({
    color: isReadOnly ? '#5e5e5e' : 'black',
  });

  const isClienteExistente = !!sugerenciasClientes.length && !!nuevoCliente.rut;

  return (
    <Modal open={open} onClose={() => { handleReset(); onClose(); }}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ backgroundColor: '#1976d2', color: 'white', padding: '10px' }}>
          Orden de trabajo: #{orderId}
        </Typography>

        <Grid container spacing={2}>
          {/* Cliente Section */}
          <Grid item xs={6}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Cliente
              </Typography>
              <TextField
                label="RUT"
                name="rut"
                value={nuevoCliente.rut}
                onChange={(e) => handleInputChange(e, setNuevoCliente)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              {sugerenciasClientes.length > 0 && (
                <List>
                  {sugerenciasClientes.map((cliente) => (
                    <ListItem button key={cliente.rut} onClick={() => handleSuggestionClickCliente(cliente)}>
                      <ListItemText primary={cliente.rut} secondary={cliente.nombre} />
                    </ListItem>
                  ))}
                </List>
              )}
              <TextField
                label="Nombre"
                name="nombre"
                value={nuevoCliente.nombre}
                onChange={(e) => handleInputChange(e, setNuevoCliente)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: isClienteExistente,
                  style: getInputStyle(isClienteExistente),
                }}
              />
              <TextField
                label="Correo"
                name="correo"
                value={nuevoCliente.correo}
                onChange={(e) => handleInputChange(e, setNuevoCliente)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: isClienteExistente,
                  style: getInputStyle(isClienteExistente),
                }}
              />
              <TextField
                label="Dirección"
                name="direccion"
                value={nuevoCliente.direccion}
                onChange={(e) => handleInputChange(e, setNuevoCliente)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: isClienteExistente,
                  style: getInputStyle(isClienteExistente),
                }}
              />
              <TextField
                label="Número"
                name="numero"
                value={nuevoCliente.numero}
                onChange={(e) => handleInputChange(e, setNuevoCliente)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: isClienteExistente,
                  style: getInputStyle(isClienteExistente),
                }}
              />
            </Box>
          </Grid>

          {/* Auto Section */}
          <Grid item xs={6}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Datos del auto
              </Typography>
              <TextField
                label="Matrícula"
                name="matricula"
                value={auto.matricula}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              {sugerenciasAutos.length > 0 && (
                <List>
                  {sugerenciasAutos.map((auto) => (
                    <ListItem button key={auto.matricula} onClick={() => handleSuggestionClickAuto(auto)}>
                      <ListItemText primary={auto.matricula} secondary={`${auto.descripcion} (${auto.color})`} />
                    </ListItem>
                  ))}
                </List>
              )}
              <TextField
                label="Descripción"
                name="descripcion"
                value={auto.descripcion}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              <TextField
                label="Color"
                name="color"
                value={auto.color}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
            </Box>
          </Grid>

          {/* Orden de Trabajo Section */}
          <Grid item xs={12}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Datos de la orden de trabajo
              </Typography>
              <TextField
                label="Descripción"
                name="descripcion"
                value={orden.descripcion}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              <TextField
                label="Monto Total"
                name="monto_total"
                value={orden.monto_total}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              <TextField
                label="Monto Pagado"
                name="monto_pagado"
                value={orden.monto_pagado}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
              <TextField
                label="Fecha Inicio"
                name="fecha_inicio"
                type="date"
                value={orden.fecha_inicio}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Fecha Término"
                name="fecha_termino"
                type="date"
                value={orden.fecha_termino}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: '20px' }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderFormModal;