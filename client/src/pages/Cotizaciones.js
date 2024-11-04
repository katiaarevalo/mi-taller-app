import React, { useState, useEffect } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Card, CardContent, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [fecha, setFecha] = useState(''); // Mantener el estado de fecha
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');

  // Función para obtener las cotizaciones desde el backend
  const fetchCotizaciones = async () => {
    try {
      const token = localStorage.getItem('token'); // Reemplaza con tu token
      const response = await axios.get('http://localhost:3001/cotizaciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    }
  };

  useEffect(() => {
    fetchCotizaciones(); // Cargar cotizaciones al iniciar el componente
  }, []);

  const validateRUT = (rut) => {
    const rutSinPuntos = rut.replace(/\./g, '').replace('-', '');
    const cuerpo = rutSinPuntos.slice(0, -1);
    const dv = rutSinPuntos.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplicador * cuerpo[i];
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);
    const dvEsperado = resultado === 10 ? 'K' : (resultado === 11 ? '0' : resultado.toString());
    
    return dv === dvEsperado;
  };

  const validatePatente = async (patente) => {
    // Aquí puedes hacer una consulta a tu base de datos para verificar si la patente existe
    // Por ahora, simplemente retornaremos true para simular una validación exitosa
    return true; // Cambia esto según tu lógica de validación de patentes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!validateRUT(rut)) {
      Swal.fire({
        title: 'Error',
        text: 'RUT inválido.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Eliminamos la validación de fecha
    // if (!validateFecha(fecha)) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: 'La fecha no puede ser anterior a hoy.',
    //     icon: 'error',
    //     confirmButtonText: 'Aceptar',
    //   });
    //   return;
    // }

    if (!await validatePatente(tipoVehiculo)) {
      Swal.fire({
        title: 'Error',
        text: 'La patente no es válida o no existe.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const nuevaCotizacion = {
      nombre,
      rut,
      fecha,
      precio,
      descripcion,
      tipoVehiculo,
    };

    try {
      const token = localStorage.getItem('token'); // Reemplaza con tu token
      await axios.post('http://localhost:3001/cotizaciones', nuevaCotizacion, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCotizaciones(); // Recargar cotizaciones
      resetForm();
      Swal.fire({
        title: 'Cotización enviada',
        text: 'La cotización ha sido creada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al agregar cotización:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al agregar la cotización.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const resetForm = () => {
    setNombre('');
    setRut('');
    setFecha('');
    setPrecio('');
    setDescripcion('');
    setTipoVehiculo('');
  };

  return (
    <Grid container spacing={3} style={{ padding: '7px' }}>
      <Grid item xs={12}>
        <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
          <CardContent>
            <Typography variant="h5">Formulario de Cotización</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="RUT"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <TextField
                label="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
              />
              <TextField
                label="Tipo de Vehículo (Patente)"
                value={tipoVehiculo}
                onChange={(e) => setTipoVehiculo(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
                Enviar Cotización
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ width: '50%', marginTop: '18px' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Tipo de Vehículo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cotizaciones.map((cotizacion) => (
                <TableRow key={cotizacion.id}>
                  <TableCell>{cotizacion.id}</TableCell>
                  <TableCell>{cotizacion.nombre}</TableCell>
                  <TableCell>{cotizacion.rut}</TableCell>
                  <TableCell>{cotizacion.fecha}</TableCell>
                  <TableCell>${cotizacion.precio}</TableCell>
                  <TableCell>{cotizacion.descripcion}</TableCell>
                  <TableCell>{cotizacion.tipoVehiculo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Cotizaciones;
