import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar, Divider, Typography, CardMedia } from '@mui/material';
import { Dashboard, TimeToLeave, Person, ExitToApp, Construction } from '@mui/icons-material';
import logo from '../images/mitaller_logo.png';

const drawerWidth = 240;
const username = "Usuario"; // Nombre de usuario para pruebas.

// listItemStyles: Me da los estilos comunes para los botones. 
const listItemStyles = {
  color: '#fff',
  '&:hover': { 
    backgroundColor: '#0d0d0d', // Fondo en hover.
    color: '#008AB4', // Color de texto e icono en hover.
  }
};

const Sidebar = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer: MENU LATERAL */}
      <Drawer
        variant="permanent"  // Que sea permanente. 
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#000', // Fondo negro del sidebar
            color: '#fff', // Texto blanco por defecto
          },
        }}
      >
        {/* PARTE 1: LOGO + TEXTO*/}
        <Box>
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 3,
              }}
            >
              {/* LOGO */}
              <CardMedia
                component="img"
                alt="mitaller"
                image={logo}
                sx={{
                  width: 180, 
                  height: 'auto',
                  mb: 2,
                }}
              />
              {/* BIENVENIDO, USUARIO */}
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                ¡Bienvenido!
              </Typography>
              <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {username}
              </Typography>
            </Box>
          </Toolbar>
        </Box>

        {/* PARTE 2: BOTONES */}
        <Box>
          <List>
            {/* BOTONES CON EL MISMO ESTILO */}
            {[
              { text: 'Analítica', icon: <Dashboard /> },
              { text: 'Órdenes de trabajo', icon: <Construction /> },
              { text: 'Vehículos', icon: <TimeToLeave /> },
              { text: 'Clientes', icon: <Person /> }
            ].map((item, index) => ( 
              <ListItem button key={index} sx={listItemStyles}>
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button sx={listItemStyles}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Salir" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;