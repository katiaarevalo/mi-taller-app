import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, Divider, Box, CircularProgress } from '@mui/material';

const CuentasPorPagarCard = () => {
  const [cuentas, setCuentas] = useState([]);
  const [totalPagar, setTotalPagar] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/account-payable');
        setCuentas(response.data);
        setTotalPagar(response.data.reduce((acc, cuenta) => acc + cuenta.Amount, 0)); 
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las cuentas:', error);
        setLoading(false);
      }
    };
    fetchCuentas();
  }, []);

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Card sx={{
      width: '300px',
      height: '550px',
      display: 'flex',
      marginLeft: '20px',
      marginTop: '-150px',
      flexDirection: 'column',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Sombra similar a la del gráfico
      borderRadius: '12px', // Bordes redondeados como el gráfico
      overflow: 'hidden', // Para evitar que el contenido se desborde
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Cuentas pendientes
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Total pendiente: ${formatAmount(totalPagar)}
            </Typography>
            <List sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px'}}>
              {cuentas.map((cuenta) => (
                <div key={cuenta.id}>
                  <ListItem>
                    <Typography>
                      {cuenta.Services} - {cuenta.Company} - ${formatAmount(cuenta.Amount)}
                    </Typography>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </>
        )}
      </CardContent> 
    </Card>
  );
};

export default CuentasPorPagarCard;