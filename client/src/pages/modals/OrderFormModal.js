import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

// ESTILO DE MODAL. 
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

// Estilo de sección. 
const sectionStyle = {
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f5f5',
  padding: '10px',
  marginBottom: '10px',
};

// Estilo parte superior de mi formulario. 
const sectionHeaderStyle = {
  backgroundColor: '#00a6ce',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px 4px 0 0',
  marginBottom: '10px',
};

// OrderFormModal --> componente funcional. 
const OrderFormModal = ({ open, onClose, orderId }) => {
  const [clientes, setClientes] = useState([]); // Lista de clientes. 
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]);  // Sugerencia de clientes.
  const [autos, setAutos] = useState([]); // Lista de autos. 
  const [sugerenciasAutos, setSugerenciasAutos] = useState([]);  // Sugerencia de autos. 
  const [isClienteEditable, setIsClienteEditable] = useState(true); // Booleano de cliente editable. 
  const [isAutoEditable, setIsAutoEditable] = useState(true);  // Booleano de auto editable.
  const [nuevoCliente, setNuevoCliente] = useState({    // Nuevo cliente con campos vacíos. 
    rut: '', nombre: '', direccion: '', numero: '', correo: ''
  });
  const [auto, setAuto] = useState({      // Datos autos con campos vacíos. 
    matricula: '', descripcion: '', color: '', cliente_actual: ''
  });
  const [orden, setOrden] = useState({    // Datos orden con campos vacíos. 
    descripcion: '', monto_total: '', monto_pagado: '',
    fecha_inicio: '', fecha_termino: '', matricula_vehiculo: '', cliente_rut: '', cliente_nombre: ''
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

  // --------   FUNCIÓN MANEJO DE CAMBIO DE INGRESO. ---------  //
  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));

    if (name === 'rut') {
      const filteredClientes = clientes.filter(cliente => cliente.rut.includes(value));
      setSugerenciasClientes(filteredClientes);
      setIsClienteEditable(true);
    }

    if (name === 'matricula') {
      const filteredAutos = autos.filter(auto => auto.matricula.includes(value));
      setSugerenciasAutos(filteredAutos);
      setIsAutoEditable(true);
    }
  };

  // ----- FUNCIÓN MANEJO DE SUGERENCIAS (CLIENTE). ----    //
  const handleSuggestionClickCliente = (cliente) => {
    setNuevoCliente({
      rut: cliente.rut,
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      numero: cliente.numero,
      correo: cliente.correo,
    });
    setOrden(prev => ({
      ...prev,
      cliente_rut: cliente.rut,
      cliente_nombre: cliente.nombre,
    }));
    setSugerenciasClientes([]);
    setIsClienteEditable(false);
  };

  // ----- FUNCIÓN MANEJO DE SUGERENCIAS (AUTO). ----    //
  const handleSuggestionClickAuto = (auto) => {
    setAuto({
      matricula: auto.matricula,
      descripcion: auto.descripcion,
      color: auto.color,
      cliente_actual: auto.cliente_actual,
    });
    setOrden(prev => ({
      ...prev,
      matricula_vehiculo: auto.matricula,
    }));
    setSugerenciasAutos([]);
    setIsAutoEditable(false);
  };
   
  // ----- FUNCIÓNES PARA REESTABLECER (CLIENTE-AUTO). ----   //
  const handleRevertCliente = () => {
    setNuevoCliente({ rut: '', nombre: '', direccion: '', numero: '', correo: '' });
    setOrden(prev => ({ ...prev, cliente_rut: '', cliente_nombre: '' }));
    setIsClienteEditable(true);
  };

  const handleRevertAuto = () => {
    setAuto({ matricula: '', descripcion: '', color: '', cliente_actual: '' });
    setOrden(prev => ({ ...prev, matricula_vehiculo: '' }));
    setIsAutoEditable(true);
  };

  // -- FUNCIÓN AUXILIAR DE ESTILO CAMPO EN "LECTURA" -- //
  const getInputStyle = (isReadOnly) => ({
    color: isReadOnly ? '#5e5e5e' : 'black',
  });

  // ---- MANEJO DE ENVÍO DE FORMULARIO --- //
  const handleSubmit = async () => {
    if (orden.monto_total <= 0 || orden.monto_pagado <= 0) {
      alert("El monto total y el monto pagado deben ser mayores a 0.");
      return;
    }

    try {
      // Cliente editable = cliente nuevo. 
      if (isClienteEditable) {
        await axios.post('http://localhost:3001/clientes', nuevoCliente, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      // Auto editable es auto nuevo. 
      if (isAutoEditable) {
        await axios.post('http://localhost:3001/autos', auto, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      // Crear la orden de trabajo. 
      await axios.post('http://localhost:3001/ordenesDeTrabajo', orden, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      onClose();
    } catch (error) {
      console.error('Error al guardar la orden de trabajo:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ backgroundColor: '#1976d2', color: 'white', padding: '10px' }}>
          Orden de trabajo
        </Typography>

        <Grid container spacing={2}>
          {/* --- SECCIÓN DE CLIENTE --- */}
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
                  readOnly: !isClienteEditable,
                  style: getInputStyle(!isClienteEditable),
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
                  readOnly: !isClienteEditable,
                  style: getInputStyle(!isClienteEditable),
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
                  readOnly: !isClienteEditable,
                  style: getInputStyle(!isClienteEditable),
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
                  readOnly: !isClienteEditable,
                  style: getInputStyle(!isClienteEditable),
                }}
              />
              <Button variant="contained" color="secondary" onClick={handleRevertCliente} disabled={isClienteEditable}>
                Restablecer
              </Button>
            </Box>
          </Grid>

          {/* --- SECCIÓN DE AUTO --- */}
          <Grid item xs={6}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Auto
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
                      <ListItemText primary={auto.matricula} secondary={auto.descripcion} />
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
                InputProps={{
                  readOnly: !isAutoEditable,
                  style: getInputStyle(!isAutoEditable),
                }}
              />
              <TextField
                label="Color"
                name="color"
                value={auto.color}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: !isAutoEditable,
                  style: getInputStyle(!isAutoEditable),
                }}
              />
              <Button variant="contained" color="secondary" onClick={handleRevertAuto} disabled={isAutoEditable}>
                Restablecer
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* --- SECCIÓN DE ORDEN --- */}
        <Box sx={sectionStyle}>
          <Typography variant="subtitle1" sx={sectionHeaderStyle}>
            Datos de la Orden de Trabajo
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
            type="number"
            value={orden.monto_total}
            onChange={(e) => handleInputChange(e, setOrden)}
            size="small"
            fullWidth
            sx={{ marginBottom: '8px' }}
          />
          <TextField
            label="Monto Pagado"
            name="monto_pagado"
            type="number"
            value={orden.monto_pagado}
            onChange={(e) => handleInputChange(e, setOrden)}
            size="small"
            fullWidth
            sx={{ marginBottom: '8px' }}
          />
          <TextField
            label="Fecha de Inicio"
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
            label="Fecha de Término"
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

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Orden
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderFormModal;