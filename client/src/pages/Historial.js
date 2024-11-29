import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, Button } from '@mui/material';

const Historial = () => {
  const [today, setToday] = useState('');
  const [historial, setHistorial] = useState([]);
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [searchRut, setSearchRut] = useState('');
  const [searchMatricula, setSearchMatricula] = useState('');

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/historial-ordenes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
      setFilteredHistorial(response.data); // Inicialmente mostramos todo el historial
    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
    const f = new Date();
    setToday(f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear());
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSearch = () => {
    let filteredData = historial;

    // Filtrar por RUT
    if (searchRut) {
      filteredData = filteredData.filter((item) =>
        item.cliente_rut.includes(searchRut)
      );
    }

    // Filtrar por matrícula
    if (searchMatricula) {
      filteredData = filteredData.filter((item) =>
        item.matricula_vehiculo.toLowerCase().includes(searchMatricula.toLowerCase())
      );
    }

    setFilteredHistorial(filteredData);
  };

  const handleClearFilters = () => {
    setSearchRut('');
    setSearchMatricula('');
    setFilteredHistorial(historial); // Restaurar a todos los elementos
  };

  const handleRutChange = (e) => {
    const value = e.target.value;
    // Solo números y la letra "K" permitidos en el RUT
    if (/^[0-9kK]*$/.test(value)) {
      setSearchRut(value.toUpperCase()); // Convertir a mayúsculas si contiene "k"
    }
  };

  const handleMatriculaChange = (e) => {
    const value = e.target.value;
    // Solo letras mayúsculas y números permitidos en la matrícula
    if (/^[A-Z0-9]*$/.test(value)) {
      setSearchMatricula(value.toUpperCase()); // Convertir a mayúsculas automáticamente
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Historial de órdenes de trabajo</Typography>

      {/* Filtros */}
      <Box style={{ marginBottom: '20px' }}>
        <TextField
          label="Buscar por RUT"
          variant="outlined"
          value={searchRut}
          onChange={handleRutChange} // Usamos la función con validación para el RUT
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Buscar por Patente"
          variant="outlined"
          value={searchMatricula}
          onChange={handleMatriculaChange} // Usamos la función con validación para la matrícula
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleClearFilters}>
          Limpiar Filtros
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Matrícula</TableCell>
              <TableCell>RUT Cliente</TableCell>
              <TableCell>Fecha de Inicio</TableCell>
              <TableCell>Fecha de Término</TableCell>
              <TableCell>Monto Total</TableCell>
              <TableCell>Monto Pagado</TableCell>
              <TableCell>Fecha de Eliminación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistorial.map((historial) => (
              <TableRow key={historial.id}>
                <TableCell>{historial.id}</TableCell>
                <TableCell>{historial.matricula_vehiculo}</TableCell>
                <TableCell>{historial.cliente_rut}</TableCell>
                <TableCell>{formatDate(historial.fecha_inicio)}</TableCell>
                <TableCell>{formatDate(historial.fecha_termino)}</TableCell>
                <TableCell>${formatAmount(historial.monto_total)}</TableCell>
                <TableCell>${formatAmount(historial.monto_pagado)}</TableCell>
                <TableCell>{formatDate(historial.fecha_eliminacion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Historial;
