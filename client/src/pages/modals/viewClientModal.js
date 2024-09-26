import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';

const ViewClientModal = ({ open, onClose, cliente }) => {
  if (!cliente) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: '#f5f5f5',
          width: '500px', // Ancho fijo del modal
          height: '370px', // Alto fijo del modal 
          maxWidth: 'none', // Evita que el modal reduzca su tamaño por defecto
        },
      }}
    >
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" color="textPrimary">
            Información del Cliente
          </Typography>
          <Divider />
          <Typography variant="body1" color="textSecondary">
            <strong>RUT:</strong> {cliente.rut}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Nombre:</strong> {cliente.nombre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Número:</strong> {cliente.numero}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Correo:</strong> {cliente.correo}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Dirección:</strong> {cliente.direccion}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={{ textTransform: 'none' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewClientModal;