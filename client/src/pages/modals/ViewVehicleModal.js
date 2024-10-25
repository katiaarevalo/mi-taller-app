import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, CircularProgress } from '@mui/material';

// -- MODAL PARA VER DETALLES DE UN VEHÍCULO -- //
// Componente que muestra los detalles de un vehículo y su historial de propietarios.
const ViewVehicleModal = ({ open, onClose, auto, historialData }) => {

  if (!auto) { // Si no hay un vehículo seleccionado, no se muestra el modal
    return null;
  }

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

  // Determina si se está cargando el historial de propietarios...
  const isLoading = !historialData || historialData.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth PaperProps={{
      style: {
        border: '2px solid #000', 
      },
    }}>
      <DialogTitle>
        <Typography variant="h6">
          Detalles del vehículo - <span style={{ fontWeight: 800 }}>{auto.matricula}</span>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} marginTop='10px'>
            <Typography variant="h6">Información del vehículo</Typography>
            <Typography variant="body1">RUT cliente: {formatRUT(auto.cliente_actual)}</Typography>
            <Typography variant="body1">Color: {auto.color}</Typography>
            <Typography variant="body1">Descripción: {auto.descripcion}</Typography>
          </Grid>
          <Grid item xs={12} marginTop='10px'>
            <Divider />
            <Typography variant="h6" marginTop='10px'>Historial de modificación de datos</Typography>
            <TableContainer component={Paper} style={{ marginTop: '10px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>RUT cliente</TableCell>
                    <TableCell>Nombre cliente</TableCell>
                    <TableCell>Fecha de cambio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress size={24} /> {/* -- INDICADOR DE CARGA -- */}
                      </TableCell>
                    </TableRow>
                  ) : historialData.length > 0 ? (
                    historialData.map((historial) => (
                      <TableRow key={historial.id}>
                        <TableCell>{formatRUT(historial.cliente_rut)}</TableCell>
                        <TableCell>{historial.Cliente?.nombre || 'No disponible'}</TableCell>
                        <TableCell>{new Date(historial.fecha_cambio).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No hay historial disponible para este vehículo.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewVehicleModal;