import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, CircularProgress } from '@mui/material';

const ViewVehicleModal = ({ open, onClose, auto, historialData }) => {
  // Validamos que el auto esté presente
  if (!auto) {
    return null;
  }

  // Comprobamos si se está cargando el historial
  const isLoading = !historialData || historialData.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Detalles del Vehículo - {auto.matricula}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Información del Vehículo */}
          <Grid item xs={12}>
            <Typography variant="h6">Información del Vehículo</Typography>
            <Typography variant="body1">Descripción: {auto.descripcion}</Typography>
            <Typography variant="body1">Color: {auto.color}</Typography>
            <Typography variant="body1">RUT Cliente Actual: {auto.cliente_actual}</Typography>
          </Grid>

          {/* Historial de Propietarios */}
          <Grid item xs={12}>
            <Typography variant="h6">Historial de Propietarios</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>RUT Cliente</TableCell>
                    <TableCell>Nombre Cliente</TableCell>
                    <TableCell>Fecha de Cambio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress size={24} /> {/* Indicador de carga */}
                      </TableCell>
                    </TableRow>
                  ) : historialData.length > 0 ? (
                    historialData.map((historial) => (
                      <TableRow key={historial.id}>
                        <TableCell>{historial.cliente_rut}</TableCell>
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
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewVehicleModal;