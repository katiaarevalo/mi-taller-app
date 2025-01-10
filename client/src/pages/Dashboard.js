import React from 'react';
import { Grid, Box } from '@mui/material';
import CuentasPorPagarCard from '../components/CuentasPorPagarCard';
import OrdersChart from '../components/OrdersChart';
import MontoPromedioOrdenCard from '../components/MontoPromedioOrdenCard';
import RecordatorioCard from '../components/RecordatorioCard';
import logo from '../images/mitaller_logo.png'; 

const Dashboard = () => {
  return (
    <Grid
      container
      spacing={0} 
      sx={{
        height: '710px',
        width: '1165px',
        marginLeft: '230px',
        padding: 0, 
        margintop: '0px', 
        justifyContent: 'space-between',
        backgroundColor: '#c4ecf2',
        position: 'relative',  
        overflow: 'hidden', // Desactiva el scroll si el contenido excede
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          marginLeft: '50px',
          top: '10px',
          left: '0px',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '190px',
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />
      </Box>

      {/* Fila superior con las tarjetas */}
      <Grid container item xs={8} spacing={0} sx={{ marginBottom: '30px', marginLeft: '25px', marginTop: '75px' }}>
        {/* Tarjeta 1 */}
        <Grid item xs={12} sm={4} lg={3} marginTop={'95px'}>
          <MontoPromedioOrdenCard />
        </Grid>

        {/* Tarjeta 2 */}
        <Grid item xs={12} sm={4} lg={6} sx={{position: 'absolute', left:'280px', top:'20px'}} >
          <RecordatorioCard />
        </Grid>
      </Grid>

      {/* Fila inferior con el gráfico */}
      <Grid item xs={12} sx={{ height: '100%', width: '100%', paddingTop: 0, marginTop: '-25px', marginLeft: '25px' }}>
        <Grid container spacing={1}>
          {/* Gráfico */}
          <Grid item xs={12} lg={8} sx={{ height: '100%' }}>
            <OrdersChart />
          </Grid>

          {/* Cuentas por Pagar (Cuenta Pendiente) */}
          <Grid item xs={12} lg={4} sx={{position: 'absolute', top: '160px', left: '820px', }}>
            <CuentasPorPagarCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;