import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Historial = () => {
  const [historial, setHistorial] = useState([]);

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/historial-ordenes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Historial de Órdenes</Typography>
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
            {historial.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell>{orden.id_original}</TableCell>
                <TableCell>{orden.matricula_vehiculo}</TableCell>
                <TableCell>{orden.cliente_rut}</TableCell>
                <TableCell>{formatDate(orden.fecha_inicio)}</TableCell>
                <TableCell>{formatDate(orden.fecha_termino)}</TableCell>
                <TableCell>${formatAmount(orden.monto_total)}</TableCell>
                <TableCell>${formatAmount(orden.monto_pagado)}</TableCell>
                <TableCell>{formatDate(orden.fecha_eliminacion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Historial;
