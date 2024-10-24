import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OrderFormModal from './modals/OrderFormModal';

const WorkOrders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);


  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/ordenes-de-trabajo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrdenes(response.data);
    } catch (error) {
      console.error('Error al obtener órdenes de trabajo:', error);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchOrdenes(); 
  };

  const filteredOrdenes = ordenes.filter(orden =>
    orden.matricula_vehiculo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}> Órdenes de trabajo </Typography>
          </Grid2>
          <Grid2 item>
            <TextField
              label="Buscar por matrícula"
              variant="outlined"
              style={{ width: '250px' }}
              margin="dense"
              value={filtro}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', height: '500px'}}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '50px' }}>ID</TableCell>
                <TableCell style={{ width: '100px' }}>Matrícula</TableCell>
                <TableCell style={{ width: '100px' }}>RUT cliente</TableCell>
                <TableCell style={{ width: '100px' }}>Fecha de inicio</TableCell>
                <TableCell style={{ width: '120px' }}>Fecha de término</TableCell>
                <TableCell style={{ width: '100px' }}>Monto total</TableCell>
                <TableCell style={{ width: '100px' }}>Monto pagado</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrdenes.map((orden) => (
                <TableRow key={orden.id}>
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.matricula_vehiculo}</TableCell>
                  <TableCell>{orden.cliente_rut}</TableCell>
                  <TableCell>{orden.fecha_inicio}</TableCell>
                  <TableCell>{orden.fecha_termino}</TableCell>
                  <TableCell>{orden.monto_total}</TableCell>
                  <TableCell>{orden.monto_pagado}</TableCell>
                  <TableCell>
                    <IconButton sx={{ '&:hover': { backgroundColor: '#008AB4' } }}><VisibilityIcon /></IconButton>
                    <IconButton sx={{ '&:hover': { backgroundColor: '#008AB4' } }}><EditIcon /></IconButton>
                    <IconButton sx={{ '&:hover': { backgroundColor: '#008AB4' } }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddClick} 
        style={{ position: 'fixed', bottom: '16px', right: '16px' }} 
      >
        <AddIcon />
      </Fab>

      <OrderFormModal open={modalOpen} onClose={handleModalClose} />
    </Grid2>
  );
};

export default WorkOrders;