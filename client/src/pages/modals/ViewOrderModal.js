import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  Typography,
  Grid,
} from '@mui/material';

// -- MODAL PARA VER DETALLES DE UNA ORDEN DE TRABAJO -- //
const ViewOrderModal = ({ open, onClose, orden, clientes }) => {
  if (!orden) { // Si no hay una orden seleccionada, no se muestra el modal
    return null;
  }

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  // Busca el cliente en la lista
  const cliente = clientes.find(cliente => cliente.rut === orden.cliente_rut);
  const clienteNombre = cliente ? cliente.nombre : 'Nombre no disponible'; // Maneja el caso donde no se encuentra el cliente

  return (
    <Dialog open={open} onClose={onClose} fullWidth PaperProps={{
      style: {
        border: '2px solid #000', 
      },
    }}>
      <DialogTitle>
        <Typography variant="h6">
          Detalles de la orden de trabajo - N° <span style={{ fontWeight: 800 }}>{orden.id}</span>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} marginTop='10px'>
            <Typography variant="h6">Datos de identificación</Typography>
            <Typography variant="body1">RUT Cliente: {orden.cliente_rut}</Typography>
            <Typography variant="body1">Nombre cliente: {clienteNombre}</Typography>
            <Typography variant="body1">Vehículo: {orden.matricula_vehiculo}</Typography>
            <Divider />
            <Typography variant="h6" marginTop='5px'>Datos de trabajo </Typography>
            <Typography variant="body1">Fecha de inicio: {new Date(orden.fecha_inicio).toLocaleDateString()}</Typography>
            <Typography variant="body1">Fecha de término: {new Date(orden.fecha_termino).toLocaleDateString()}</Typography>
            <Typography variant="body1">Descripción: {orden.descripcion}</Typography>    
            <Divider />
            <Typography variant="h6" marginTop='5px' >Detalle pago</Typography>
            <Typography variant="body1">Monto total: ${formatAmount(orden.monto_total.toLocaleString())}</Typography>
            <Typography variant="body1">Monto pagado: ${formatAmount(orden.monto_pagado.toLocaleString())}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewOrderModal;