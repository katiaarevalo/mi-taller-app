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
  height: '50%',
  maxHeight: '1000px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto',
};

// Estilo de sección. 
const sectionStyle = {
  border: '1px #FFFFFF',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
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
const ViewFormModal = ({ open, onClose, orderId, Orders }) => {
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
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
      const filteredClientes = clientes.filter(cliente => cliente.rut.includes(value));
      setSugerenciasClientes(filteredClientes);
      setIsClienteEditable(true); // Cliente habilitado para ser editable.
    }

    if (name === 'matricula') {
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
    }));
    setSugerenciasAutos([]); // Limpia sugerencias.
    setIsAutoEditable(false); // Bloquea los campos.
  };
   



  // ---- MANEJO DE ENVÍO DE FORMULARIO --- //
  // Sigue la logica establecedida de que se debe enviar primero el cliente, //
  // una vez existente se debe crear el auto y, posterior, crear la orden de trabajo. //

  if (!Orders) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
          Órden de trabajo
        </Typography>

        <Grid container spacing={3}>
          {/* --- SECCIÓN DE CLIENTE --- */}
  


          {/* --- SECCIÓN ORDEN DE TRABAJO --- */}
          <Grid item xs={12}>
            <Box sx={sectionStyle}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
               
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                {/* --- ORDEN_TRABAJO: CAMPO CLIENTE RUT --- */}
                <TextField
                label="RUT Cliente"
                name="cliente_rut"
                value={Orders.cliente_rut}

                size="small"
                fullWidth
                sx={{marginBottom: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Cambia el color del borde
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Cambia el color del borde al pasar el ratón
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Cambia el color del borde cuando está enfocado
                    },
                  },}}
                inputProps={{ readOnly: true }}
            
              />
                </Grid>
                <Grid item xs={6}>
                  {/* --- ORDEN_TRABAJO: FECHA INICIO --- */}
                <TextField
                    label="Fecha de Inicio"
                    name="fecha_inicio"
                    
                    value={formatDate(Orders.fecha_inicio)}

                    size="small"
                    fullWidth
                    inputProps={{ readOnly: true }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: '8px', marginLeft: '160px' ,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white', // Cambia el color del borde
                        },
                        '&:hover fieldset': {
                          borderColor: 'white', // Cambia el color del borde al pasar el ratón
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white', // Cambia el color del borde cuando está enfocado
                        },
                      },}}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                {/* --- ORDEN_TRABAJO: CAMPO MATRICULA VEHICULO --- */}
                <TextField
                  label="Matrícula Vehículo"
                  name="matricula_vehiculo"
                  value={Orders.matricula_vehiculo}

                  size="small"
                  fullWidth
                  sx={{ marginBottom: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white', // Cambia el color del borde
                      },
                      '&:hover fieldset': {
                        borderColor: 'white', // Cambia el color del borde al pasar el ratón
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white', // Cambia el color del borde cuando está enfocado
                      },
                    },}} 
                  inputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                {/* --- ORDEN_TRABAJO: CAMPO FECHA TÉRMINO --- */}
                <TextField
                    label="Fecha de Término"
                    name="fecha_termino"
                    
                    value={formatDate(Orders.fecha_termino)}

                    size="small"
                    fullWidth
                    inputProps={{ readOnly: true }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: '8px', marginLeft: '160px' ,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white', // Cambia el color del borde
                        },
                        '&:hover fieldset': {
                          borderColor: 'white', // Cambia el color del borde al pasar el ratón
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white', // Cambia el color del borde cuando está enfocado
                        },
                      },}}
                  />
                </Grid>
              </Grid>
              {/* --- ORDEN_TRABAJO: CAMPO DESCRIPCIÓN --- */}
              <TextField
                label="Descripción"
                name="descripcion"
                value={Orders.descripcion}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Cambia el color del borde
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Cambia el color del borde al pasar el ratón
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Cambia el color del borde cuando está enfocado
                    },
                  },}}       
                size="small"
                fullWidth
                multiline
                rows={4}
                inputProps={{ readOnly: true }}

              />
              {/* --- ORDEN_TRABAJO: MONTO TOTAL --- */}
              <TextField
                label="Monto Total"
                name="monto_total"
                value={Orders.monto_total}

                size="small"
                fullWidth
                sx={{ marginBottom: '8px', marginTop: '10px' ,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Cambia el color del borde
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Cambia el color del borde al pasar el ratón
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Cambia el color del borde cuando está enfocado
                    },
                  },}}
                inputProps={{ readOnly: true }}
              />
              {/* --- ORDEN_TRABAJO: MONTO PAGADO --- */}
              <TextField
                label="Monto Pagado"
                name="monto_pagado"
                value={Orders.monto_pagado}
                size="small"
                fullWidth
                sx={{ marginBottom: '8px' ,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Cambia el color del borde
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Cambia el color del borde al pasar el ratón
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Cambia el color del borde cuando está enfocado
                    },
                  },}}
                inputProps={{ readOnly: true }}
              />
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Modal>
  );
};

export default ViewFormModal;