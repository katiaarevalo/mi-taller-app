import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar, Divider, Typography, CardMedia } from '@mui/material';
import { Dashboard, TimeToLeave, Person, ExitToApp, Construction, Assignment, CalendarToday, LocalShipping , PersonOff} from '@mui/icons-material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import logo from '../images/mitaller_logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LibraryBooks } from '@mui/icons-material';

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

  // Ajuste dinámico del ancho del Sidebar dependiendo de la ruta
  const currentDrawerWidth =  240 ;

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Función para manejar el clic en el botón "Salir"
  const handleLogoutClick = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cerrar sesión
        navigate('/login');
      }
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer: MENU LATERAL */}
      <Drawer
        variant="permanent"  // Que sea permanente. 
        sx={{
          width: currentDrawerWidth, // Ancho dinámico según la ruta
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth, // Ancho dinámico según la ruta
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
                flexDirection: 'row',
                alignItems: 'center',
                mt: 1,
                minHeight: 0,
              }}
            >
              {/* LOGO */}
              <CardMedia
                component="img"
                alt="mitaller"
                image={logo}
                sx={{
                  width: 55, 
                  height: 'auto',
                  mb: 2,
                  marginBottom: '4px'
                }}
              />
              {/* BIENVENIDO, USUARIO */}
              <Typography variant="h6" sx={{ textAlign: 'center', marginLeft:'10px' }}>
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
              { text: 'Calendario de órdenes', icon: <CalendarToday />, path: '/work-orders-calendar' },
              { text: 'Órdenes de trabajo', icon: <Construction />, path: '/work-orders' },
              { text: 'Historial de órdenes', icon: < ManageHistoryIcon/>, path: '/historial-ordenes' },
              { text: 'Clientes', icon: <Person />, path: '/clients' },
              { text: 'Vehículos', icon: <TimeToLeave />, path: '/vehicles' },
              { text: 'Cotizaciones', icon: <Assignment />, path: '/cotizaciones' },
              { text: 'Deudores', icon: <PersonOff />, path: '/debtors' },
              { text: 'Servicios', icon: <RequestQuoteIcon />, path: '/account-payable' },
              { text: 'Proveedores', icon: <LocalShipping />, path: '/suppliers' },
              { text: 'Inventario', icon: <LibraryBooks />, path: '/InventoryPage' },
              { text: 'Personal', icon: <Person />, path: '/personal'},
              { text: 'Reservas', icon: <Assignment />, path: '/reservations' }
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
          <Divider sx={{ my: 0.5, borderColor: '#fff' }} />
          <List>
            <ListItem button sx={listItemStyles} onClick={handleLogoutClick}>
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
