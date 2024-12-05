import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import CuentasPorPagarCard from '../components/CuentasPorPagarCard';
import OrdersChart from '../components/OrdersChart';

const Dashboard = () => {
  return (
    <Grid
      container
      spacing={0} // Eliminar el espacio entre las tarjetas y el gráfico
      sx={{
        height: '100%',
        padding: 0, // Espacio general alrededor
        margin: 0, // Eliminar márgenes por si los hay
        justifyContent: 'space-between', // Asegura que los elementos ocupen todo el ancho disponible
        backgroundColor: '#fff',
      }}
    >
      {/* Fila superior con las tarjetas */}
      <Grid container item xs={8} spacing={0} sx={{ marginBottom: '30px', marginLeft:'240px', marginTop: '0'}}>

        {/* Tarjeta 1 */}
        <Grid item xs={12} sm={4} lg={3}>
          <Box
            sx={{
              width: '100%',
              height: '125px',
              backgroundColor: 'white',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              padding: '0px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6">Tarjeta 1</Typography>
            <Typography>Contenido de la tarjeta 1.</Typography>
          </Box>
        </Grid>
    
        {/* Tarjeta 2 */}
        <Grid item xs={12} sm={4} lg={3}>
          <Box
            sx={{
              width: '100%',
              height: '125px',
              backgroundColor: 'white',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              padding: '0px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6">Tarjeta 2</Typography>
            <Typography>Contenido de la tarjeta 2.</Typography>
          </Box>
        </Grid>

        {/* Tarjeta 3 */}
        <Grid item xs={12} sm={4} lg={3}>
          <Box
            sx={{
              width: '100%',
              height: '125px',
              backgroundColor: 'white',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              padding: '0px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6">Tarjeta 3</Typography>
            <Typography>Contenido de la tarjeta 3.</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Fila inferior con el gráfico */}
      <Grid item xs={12} sx={{ height: '100%', width: '100%', paddingTop: 0, marginTop: '0px', marginLeft: '240px' }}>
        <Grid container spacing={1}>
          {/* Gráfico */}
          <Grid item xs={12} lg={8} sx={{ height: '100%' }}>
            <OrdersChart />
          </Grid>

          {/* Cuentas por Pagar (Cuenta Pendiente) */}
          <Grid item xs={12} lg={4} sx={{ height: '100%' }}>
            <CuentasPorPagarCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;