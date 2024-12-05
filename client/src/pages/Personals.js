import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import PersonalFormModal from './modals/PersonalsFormModal';
import EditPersonalModal from './modals/EditPersonalModal'; 
import ViewPersonalModal from './modals/ViewPersonalModal';
import { truncateString } from '../helpers/truncate';
import Swal from 'sweetalert2';

const Personal = () => {
  const [personal, setPersonal] = useState([]); 
  const [filtro, setFiltro] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [editModalOpen, setEditModalOpen] = useState(false);  
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false); 
  const [selectedViewPersonal, setSelectedViewPersonal] = useState(null); 

  // -- OBTENER LISTA DE PERSONAL -- //
  const fetchPersonal = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/personal', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setPersonal(response.data);
    } catch (error) {
      console.error('Error al obtener personal:', error);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, []);

  // -- FILTRAR PERSONAL -- //
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  // -- AGREGAR PERSONAL -- //
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- EDITAR PERSONAL -- //
  const handleEditClick = (personal) => {
    setSelectedPersonal(personal); 
    setEditModalOpen(true); 
  };

  // -- CERRAR MODAL DE AGREGAR PERSONAL -- //
  const handleModalClose = () => {
    setModalOpen(false);
    fetchPersonal();
  };

  // -- CERRAR MODAL DE EDITAR PERSONAL -- //
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchPersonal(); 
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
              await axios.delete(`http://localhost:3001/personal/${rut}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              fetchPersonal(); // Refresca la lista después de eliminar
              Swal.fire({
                title: 'Personal eliminado',
                text: 'El cliente ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            } catch (error) {
              console.error('Error al eliminar el personal:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el personal.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        });
      }
    });
  };

  // -- VER PERSONAL -- //
  const handleViewClick = (personal) => {
    setSelectedViewPersonal(personal); 
    setViewModalOpen(true); 
  };

  // -- CERRAR MODAL DE VER PERSONAL -- //
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedViewPersonal(null); 
  };

  const formatRUT = (rut) => {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    const dv = rut.slice(-1);
    const rutWithoutDV = rut.slice(0, -1);
    return rutWithoutDV.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  };

  const filteredPersonal = personal.filter(personal =>
    personal.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    personal.rut.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}>Personal</Typography>
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
                <TableCell style={{ width: '100px' }}>RUT</TableCell>
                <TableCell style={{ width: '150px' }}>Nombre</TableCell>
                <TableCell style={{ width: '100px' }}>Teléfono</TableCell>
                <TableCell style={{ width: '200px' }}>Correo</TableCell>
                <TableCell style={{ width: '150px' }}>Cargo</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPersonal.map((personal) => (
                <TableRow key={personal.rut}>
                  <TableCell>{formatRUT(personal.rut)}</TableCell>
                  <TableCell>{personal.nombre}</TableCell>
                  <TableCell>{personal.telefono}</TableCell>
                  <TableCell>{personal.correo}</TableCell>
                  <TableCell>{truncateString(personal.cargo, 12)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewClick(personal)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(personal)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(personal.rut)} color="secondary">
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

      <PersonalFormModal open={modalOpen} onClose={handleModalClose} />
      <EditPersonalModal open={editModalOpen} onClose={handleEditModalClose} personal={selectedPersonal} />
      <ViewPersonalModal open={viewModalOpen} onClose={handleViewModalClose} personal={selectedViewPersonal} />
    </Grid2>
  );
};

export default Personal;
