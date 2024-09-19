import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar, Divider, Typography, CardMedia } from '@mui/material';
import { Dashboard, TimeToLeave, Person, ExitToApp, Construction } from '@mui/icons-material';
import logo from '../images/mitaller_logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

// listItemStyles: Me da los estilos comunes para los botones. 
const listItemStyles = {
  color: '#fff',
  '&:hover': { 
    backgroundColor: '#0d0d0d', // Fondo en hover.
    color: '#008AB4', // Color de texto e icono en hover.
  }
};

// Estilo para el botón activo
const activeListItemStyles = {
  ...listItemStyles,
  backgroundColor: '#0d0d0d',
  color: '#008AB4',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    navigate(path);
  };

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
            </Box>
          </Toolbar>
        </Box>

        {/* PARTE 2: BOTONES */}
        <Box>
          <List>
            {/* BOTONES CON EL MISMO ESTILO */}
            {[
              { text: 'Analítica', icon: <Dashboard />, path: '/analytics' },
              { text: 'Órdenes de trabajo', icon: <Construction />, path: '/work-orders' },
              { text: 'Vehículos', icon: <TimeToLeave />, path: '/vehicles' },
              { text: 'Clientes', icon: <Person />, path: '/clients' }
            ].map((item, index) => ( 
              <ListItem 
                button 
                key={index}
                sx={location.pathname === item.path ? activeListItemStyles : listItemStyles}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button sx={listItemStyles} onClick={() => handleNavigation('/login')}>
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