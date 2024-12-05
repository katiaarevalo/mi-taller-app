import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import DebtorFormModal from './modals/DebtorFormModal';
import EditDebtorModal from './modals/EditDebtorModal';
import ViewDebtorModal from './modals/ViewDebtorModal';
import Swal from 'sweetalert2';

const Debtors = () => {
  const [debtors, setDebtors] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  //const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedViewDebtor, setSelectedViewDebtor] = useState(null);
    
  // -- OBTENER LISTA DE DEUDORES -- //
  // Función para obtener la lista de deudores.
  // Se ejecuta al cargar la página y al cerrar el modal de agregar deudor.
  const fetchDebtors = async () => {
      try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/deudores', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setDebtors(response.data);
    } catch (error) {
      console.error('Error al obtener deudores:', error);
    }
  };
    
  useEffect(() => {
    fetchDebtors();
  }, []);

  // -- FILTRAR DEUDORES -- //
  // Función para filtrar deudores por RUT.
  // Se ejecuta al escribir en el campo de búsqueda.
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  }

  // -- AGREGAR DEUDOR -- //
  // Función para abrir el modal de agregar deudor.
  const handleAddClick = () => {
    setOpenAddModal(true);
  }

  // -- EDITAR DEUDOR -- //
  // Función para abrir el modal de edición de deudor.
  const handleEditModalOpen = (edit_debtor) => {
    setSelectedDebtor(edit_debtor); 
    setOpenEditModal(true); 
  }

  // -- VER DEUDOR -- //
  // Función para abrir el modal de ver deudor.
  const handleViewModalOpen = (debtor) => {
    setSelectedDebtor(debtor);  
    setSelectedViewDebtor(true); 
  }

  const handleViewModalClose = () => {
    setSelectedViewDebtor(false);
    setSelectedDebtor(null);
    fetchDebtors();
  };

  const handleAddModalClose = () => {
    //setSelectedViewDebtor(false);
    setOpenAddModal(null);
    fetchDebtors();
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setSelectedDebtor(null);
    fetchDebtors();
  };

  // -- ELIMINAR DEUDOR -- //
  // Función para eliminar un deudor.
  const handleDeleteDebtor = (debtor) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
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
              await axios.delete(`http://localhost:3001/deudores/${debtor}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              fetchDebtors(); // Refresca la lista después de eliminar
              Swal.fire({
                title: 'Deudor eliminado',
                text: 'El deudor ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            } catch (error) {
              console.error('Error al eliminar el deudor:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el deudor.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        });
      }
    });
  }

  return (
      <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Grid2 item xs={10}>
          <Grid2 container alignItems="center" justifyContent="space-between">
            <Grid2 item>
              <Typography variant="h4" style={{ marginBottom: '0px' }}>Deudores morosos</Typography>
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Buscar por RUT"
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
    
        <Grid2 item xs={12}>
          <TableContainer component={Paper} style={{ width: '100%', height: '500px'}}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '100px' }}>RUT cliente</TableCell>
                  <TableCell style={{ width: '150px' }}>Monto a deber</TableCell>
                  <TableCell style={{ width: '150px' }}>Fecha de vencimiento</TableCell>
                  <TableCell style={{ width: '100px' }}>Estado</TableCell>
                  <TableCell style={{ width: '150px' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debtors
                  .filter((debtor) => {
                    return debtor.cliente_rut.toLowerCase().includes(filtro.toLowerCase());
                  })
                  .map((debtor) => (
                    <TableRow key={debtor.cliente_rut}>
                      <TableCell>{debtor.cliente_rut}</TableCell>
                      <TableCell>{debtor.monto_deuda}</TableCell>
                      <TableCell>{debtor.fecha_vencimiento}</TableCell>
                      <TableCell>{debtor.estado}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewModalOpen(debtor)} aria-label='Ver' color='default'>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditModalOpen(debtor)} aria-label="Editar" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDebtor(debtor.id)} aria-label="Eliminar" color="secondary">
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
          <EditDebtorModal open={openEditModal} onClose={handleEditModalClose} debtor={selectedDebtor} />
          <ViewDebtorModal open={selectedViewDebtor} onClose={handleViewModalClose} debtor={selectedDebtor} />
          <DebtorFormModal open={openAddModal} onClose={handleAddModalClose} />
      </Grid2>
      
  );
};

//
//


export default Debtors;