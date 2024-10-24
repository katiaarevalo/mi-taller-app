import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { validateRut } from '../../helpers/validateRut';
import { validarMatricula } from '../../helpers/validateMatricula';

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

//Estilo
const sectionHeaderStyle = {
  backgroundColor: '#00a6ce',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px 4px 0 0',
  marginBottom: '10px',
};

// OorderFormModal --> componente funcional. 
// Recibe:           - open : boolenado para saber si el modal está abierto. 
//                   - onClose: dedicado a cerrar el modal. 
//                   - orderID: Identidicador. 
const OrderFormModal = ({ open, onClose, orderId }) => {
  const [clientes, setClientes] = useState([]); //Lista de clientes. 
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]);  // Sugerencia de clientes.
  const [autos, setAutos] = useState([]); // Lista de autos. 
  const [sugerenciasAutos, setSugerenciasAutos] = useState([]);  //Sugerencia de autos. 
  const [isClienteEditable, setIsClienteEditable] = useState(true); // Booleano de cliente editable. 
  const [isAutoEditable, setIsAutoEditable] = useState(true);  // Booleano de auto editable.
  const [nuevoCliente, setNuevoCliente] = useState({    // Nuevo cliente con campos vacios. 
    rut: '', nombre: '', direccion: '', numero: '', correo: ''
  });
  const [auto, setAuto] = useState({      // datos autos con campos vacios. 
    matricula: '', descripcion: '', color: '', cliente_actual: ''
  });
  const [orden, setOrden] = useState({    // datos orden con campos vacios. 
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
  // Maneja los cambios en los inputs del formulario del modal. //
  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  
    if (name === 'rut') {
      if (!validateRut(value)) {
        console.error('RUT no válido');
        return; // Sale si el RUT no es válido
      }
  
      const filteredClientes = clientes.filter(cliente => cliente.rut.includes(value));
      setSugerenciasClientes(filteredClientes);
      setIsClienteEditable(true); // Cliente habilitado para ser editable.
    }
  
    if (name === 'matricula') {
      if (!validarMatricula(value)) {
        console.error('Matrícula no válida');
        return; // Sale si la matrícula no es válida
      }
  
      const filteredAutos = autos.filter(auto => auto.matricula.includes(value));
      setSugerenciasAutos(filteredAutos);
      setIsAutoEditable(true); // Auto habilitado para ser editable.
    }
  };

  // ----- FUNCIÓN MANEJO DE SUGERENCIAS (CLIENTE). ----    //
  // Maneja la selección de sugerencia de usuario. Es decir //
  // actualiza estado y la orden, limpia las sugerencias    //
  // y bloquea la edición de los campos del cliente.        //
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
    setSugerenciasClientes([]); // Limpia sugerencias después de seleccionar.
    setIsClienteEditable(false); // Bloquea los campos.
  };

   // ----- FUNCIÓN MANEJO DE SUGERENCIAS (AUTO). ----    //
   // Maneja la selección de sugerencia de matricula.     //
   // actualiza estado y la orden, limpia las sugerencias //
   // y bloquea la edición de los campos del auto.       //
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
      cliente_rut: auto.cliente_actual // Esto establece el RUT del cliente directamente
    }));
    setSugerenciasAutos([]); // Limpia sugerencias.
    setIsAutoEditable(false); // Bloquea los campos.
  };
   
     // ----- FUNCIÓNES PARA REESTABLECER (CLIENTE-AUTO). ----   //
    // Me permite reestablecer los campos para facilitar el    //
   // correcto funcionamiento y habilitar nuevamente los     //
  // campos de cliente y auto para poder editarlos (true)  //
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

  // -- FUNCIÓNA AUXILIAR DE ESTILO CAMPO EN "LECTURA" -- //
  const getInputStyle = (isReadOnly) => ({
    color: isReadOnly ? '#5e5e5e' : 'black',
  });


  // ---- MANEJO DE ENVÍO DE FORMULARIO --- //
  // Sigue la logica establecedida de que se debe enviar primero el cliente, //
  // una vez existente se debe crear el auto y, posterior, crear la orden de trabajo. //
  const handleSubmit = async () => {
  try {
    // Validar RUT antes de continuar
    if (!validateRut(nuevoCliente.rut)) {
      console.error('RUT no válido');
      return;
    }

    // Validar matrícula antes de continuar
    if (!validarMatricula(auto.matricula)) {
      console.error('Matrícula no válida');
      return;
    }

    console.log('Nuevo Cliente:', nuevoCliente);
    console.log('Auto:', auto);
    console.log('Orden:', orden);

    // Cliente editable es cliente nuevo.
    if (isClienteEditable) {
      // Crear nuevo cliente
      await axios.post('http://localhost:3001/clientes', nuevoCliente, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    }

    // Auto editable es auto nuevo.
    if (isAutoEditable) {
      // Crear nuevo auto
      await axios.post('http://localhost:3001/autos', auto, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    }

    // Crear la orden de trabajo
    const orderData = {
      ...orden,
      cliente_rut: nuevoCliente.rut,
      matricula_vehiculo: auto.matricula,
    };

    console.log('Order Data:', orderData); // Verifica que la data sea correcta

    await axios.post('http://localhost:3001/ordenes-de-trabajo', orderData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Limpiar el formulario
    handleRevertCliente();
    handleRevertAuto();
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

    onClose(); // Cerrar el modal
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
              {/* --- CLIENTE: CAMPO RUT --- */}
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
              {/* --- CLIENTE: CAMPO NOMBRE --- */}
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
              {/* --- CLIENTE: CAMPO DIRECCIÓN --- */}
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
              {/* --- CLIENTE: CAMPO NÚMERO --- */}
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
              {/* --- CLIENTE: CAMPO CORREO --- */}
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
              <Button onClick={handleRevertCliente} disabled={isClienteEditable} variant="outlined" color="secondary">
                Restablecer Cliente
              </Button>
            </Box>
          </Grid>

          {/* --- SECCIÓN AUTO --- */}
          <Grid item xs={6}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Auto
              </Typography>
              {/* --- AUTO: CAMPO NÚMERO --- */}
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
              {/* --- AUTO: CAMPO CLIENTE REGISTRADO --- */}
              <TextField
                label="Cliente Actual"
                name="cliente_actual"
                value={auto.cliente_actual}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: !isAutoEditable,
                  style: getInputStyle(!isAutoEditable),
                }}
              />
              {/* --- AUTO: CAMPO COLOR --- */}
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
              {/* --- AUTO: DESCRIPCIÓN --- */}
              <TextField
                label="Descripción"
                name="descripcion"
                value={auto.descripcion}
                onChange={(e) => handleInputChange(e, setAuto)}
                size="small"
                fullWidth
                multiline
                rows={3}
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: !isAutoEditable,
                  style: getInputStyle(!isAutoEditable),
                }}
              />
              <Button onClick={handleRevertAuto} disabled={isAutoEditable} variant="outlined" color="secondary">
                Restablecer Auto
              </Button>
            </Box>
          </Grid>

          {/* --- SECCIÓN ORDEN DE TRABAJO --- */}
          <Grid item xs={12}>
            <Box sx={sectionStyle}>
              <Typography variant="subtitle1" sx={sectionHeaderStyle}>
                Datos de la Orden de Trabajo
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                {/* --- ORDEN_TRABAJO: CAMPO CLIENTE RUT --- */}
                <TextField
                label="RUT Cliente"
                name="cliente_rut"
                value={orden.cliente_rut}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
                InputProps={{
                  readOnly: true,
                  style: getInputStyle(true),
                }}
              />
                </Grid>
                <Grid item xs={6}>
                  {/* --- ORDEN_TRABAJO: FECHA INICIO --- */}
                <TextField
                    label="Fecha de Inicio"
                    name="fecha_inicio"
                    type="date"
                    value={orden.fecha_inicio}
                    onChange={(e) => handleInputChange(e, setOrden)}
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: '8px', marginLeft: '160px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                {/* --- ORDEN_TRABAJO: CAMPO MATRICULA VEHICULO --- */}
                <TextField
                  label="Matrícula Vehículo"
                  name="matricula_vehiculo"
                  value={orden.matricula_vehiculo}
                  onChange={(e) => handleInputChange(e, setOrden)}
                  size="small"
                  fullWidth
                  sx={{ marginBottom: '8px' }}
                  InputProps={{
                    readOnly: true,
                    style: getInputStyle(true),
                  }}
                  />
                </Grid>
                <Grid item xs={6}>
                {/* --- ORDEN_TRABAJO: CAMPO FECHA TÉRMINO --- */}
                <TextField
                    label="Fecha de Término"
                    name="fecha_termino"
                    type="date"
                    value={orden.fecha_termino}
                    onChange={(e) => handleInputChange(e, setOrden)}
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: '8px', marginLeft: '160px' }}
                  />
                </Grid>
              </Grid>
              {/* --- ORDEN_TRABAJO: CAMPO DESCRIPCIÓN --- */}
              <TextField
                label="Descripción"
                name="descripcion"
                value={orden.descripcion}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                multiline
                rows={4}
              />
              {/* --- ORDEN_TRABAJO: MONTO TOTAL --- */}
              <TextField
                label="Monto Total"
                name="monto_total"
                value={orden.monto_total}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px', marginTop: '10px' }}
              />
              {/* --- ORDEN_TRABAJO: MONTO PAGADO --- */}
              <TextField
                label="Monto Pagado"
                name="monto_pagado"
                value={orden.monto_pagado}
                onChange={(e) => handleInputChange(e, setOrden)}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' }}
              />
            </Box>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: '20px' }}>
          Guardar Orden de Trabajo
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderFormModal;