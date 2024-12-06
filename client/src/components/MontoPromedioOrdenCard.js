import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

const MontoPromedioOrdenCard = () => {
  const [montoPromedio, setMontoPromedio] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        // Obtén el token desde el localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setLoading(false);
          return;
        }

        // Configura el encabezado Authorization
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Realiza la solicitud para obtener todas las órdenes de trabajo
        const response = await axios.get('http://localhost:3001/ordenes-de-trabajo', config);
        const ordenes = response.data;

        // Calcular el monto promedio
        if (ordenes.length > 0) {
          const totalMonto = ordenes.reduce((sum, orden) => sum + parseFloat(orden.monto_total), 0);
          const promedio = totalMonto / ordenes.length;
          setMontoPromedio(promedio);
        } else {
          setMontoPromedio(0); // No hay órdenes, promedio 0
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las órdenes de trabajo:', error);
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  return (
    <Card sx={{
      width: '100%',
      height: '100px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0px',
    }}>
      <CardContent sx={{ padding: '16px' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
          Monto promedio por orden de trabajo
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
            ${montoPromedio.toLocaleString('es-CL')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MontoPromedioOrdenCard;