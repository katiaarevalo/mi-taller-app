import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import ClientFormModal from './modals/ClientsFormModal';
import EditClientModal from './modals/EditClientModal'; 
import ViewClientModal from './modals/viewClientModal';
import { truncateString } from '../helpers/truncate';
import Swal from 'sweetalert2';

const Clients = () => {
  const [clientes, setClientes] = useState([]); 
  const [filtro, setFiltro] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [editModalOpen, setEditModalOpen] = useState(false);  
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false); 
  const [selectedViewClient, setSelectedViewClient] = useState(null); 

  // -- OBTENER LISTA DE CLIENTES -- //
  // Función para obtener la lista de clientes.
  // Se ejecuta al cargar la página y al cerrar el modal de agregar cliente.
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/clientes', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // -- FILTRAR CLIENTES -- //
  // Función para filtrar clientes por nombre o RUT.
  // Se ejecuta al escribir en el campo de búsqueda.
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  // -- AGREGAR CLIENTE -- //
  // Función para abrir el modal de agregar cliente.
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- EDITAR CLIENTE -- //
  // Función para abrir el modal de edición de cliente.
  const handleEditClick = (cliente) => {
    setSelectedCliente(cliente); 
    setEditModalOpen(true); 
  };

  // -- CERRAR MODAL DE AGREGAR CLIENTE -- //
  // Función para cerrar el modal de agregar cliente.
  const handleModalClose = () => {
    setModalOpen(false);
    fetchClientes();
  };

  // -- CERRAR MODAL DE EDITAR CLIENTE -- //
  // Función para cerrar el modal de edición de cliente.
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchClientes(); 
  };

  // -- ELIMINAR CLIENTE -- //
  // Función para eliminar un cliente.
  const handleDelete = async (rut) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Confirmar eliminación',
          text: "Esta acción no se puede deshacer. ¿Confirmas la eliminación?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              const token = localStorage.getItem('token');
              await axios.delete(`http://localhost:3001/clientes/${rut}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              fetchClientes(); // Refresca la lista después de eliminar
              Swal.fire({
                title: 'Cliente eliminado',
                text: 'El cliente ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            } catch (error) {
              console.error('Error al eliminar el cliente:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el cliente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        });
      }
    });
  };

  // -- VER CLIENTE -- //
  // Función para abrir el modal de visualización de cliente.
  const handleViewClick = (cliente) => {
    setSelectedViewClient(cliente); 
    setViewModalOpen(true); 
  };

  // -- CERRAR MODAL DE VER CLIENTE -- //
  // Función para cerrar el modal de visualización de cliente.
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedViewClient(null); 
  };

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

  // filteredClientes es la lista de clientes filtrada por nombre o RUT.
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.rut.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}>Clientes</Typography>
          </Grid2>
          <Grid2 item>
            <TextField
              label="Buscar por nombre o RUT"
              variant="outlined"
              style={{ width: '250px' }}
              margin="dense"
              value={filtro}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Tabla */}
      <Grid2 item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', height: '500px'}}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '100px' }}>RUT cliente</TableCell>
                <TableCell style={{ width: '150px' }}>Nombre</TableCell>
                <TableCell style={{ width: '100px' }}>Teléfono</TableCell>
                <TableCell style={{ width: '200px' }}>Correo</TableCell>
                <TableCell style={{ width: '150px' }}>Dirección</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.rut}>
                  <TableCell>{formatRUT(cliente.rut)}</TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.numero}</TableCell>
                  <TableCell>{cliente.correo}</TableCell>
                  <TableCell>{truncateString(cliente.direccion, 12)}</TableCell> {/* Usar la función aquí */}
                  <TableCell>
                  <IconButton onClick={() => handleViewClick(cliente)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(cliente)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(cliente.rut)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      <Fab color="primary" onClick={handleAddClick} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>

      <ClientFormModal open={modalOpen} onClose={handleModalClose} />
      <EditClientModal open={editModalOpen} onClose={handleEditModalClose} cliente={selectedCliente} /> {/* Agrega el modal de edición */}
      <ViewClientModal open={viewModalOpen} onClose={handleViewModalClose} cliente={selectedViewClient} />

    </Grid2>
  );
};

export default Clients;