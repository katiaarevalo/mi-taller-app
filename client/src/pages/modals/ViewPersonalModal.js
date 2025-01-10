import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';

const ViewPersonalModal = ({ open, onClose, personal }) => {
    if (!personal) return null;
  
    const formatRUT = (rut) => {
      // Eliminar puntos y guiones existentes
      rut = rut.replace(/\./g, '').replace(/-/g, '');
    
      // Extraer el dígito verificador
      const dv = rut.slice(-1);
      const rutWithoutDV = rut.slice(0, -1);
    
      // Formatear el RUT con puntos y guión
      const formattedRUT = rutWithoutDV.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    
      return formattedRUT;
    };
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            width: '500px', 
            height: 'auto', 
            maxWidth: 'none', 
            border: '2px solid #000',
            borderRadius: '8px', 
            padding: '16px', 
          },
        }}
      >
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
              Información del Personal
            </Typography>
            <Divider />
            <Typography variant="body1" sx={{ color: 'black' }}>
              <strong>RUT :</strong> {formatRUT(personal.rut)}
            </Typography>
            <Typography variant="body1" sx={{ color: 'black' }}>
            <strong>Nombre:</strong> {personal.nombre}
          </Typography>
          <Typography variant="body1" sx={{ color: 'black' }}>
            <strong>Cargo:</strong> {personal.cargo}
          </Typography>
          <Typography variant="body1" sx={{ color: 'black' }}>
            <strong>Teléfono:</strong> {personal.telefono}
          </Typography>
          <Typography variant="body1" sx={{ color: 'black' }}>
            <strong>Correo:</strong> {personal.correo}
          </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


export default ViewPersonalModal;