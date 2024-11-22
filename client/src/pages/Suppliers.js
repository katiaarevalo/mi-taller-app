import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import SupplierFormModal from './modals/SupplierFormModal';
import EditSupplierModal from './modals/EditSupplierModal';
import ViewSupplierModal from './modals/ViewSupplierModal';
import Swal from 'sweetalert2';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewSupplier, setSelectedViewSupplier] = useState(null);

  // -- OBTENER LISTA DE PROVEEDORES -- //
  // Función para obtener la lista de proveedores.
  // Se ejecuta al cargar la página y al cerrar el modal de agregar proveedor.
  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/proveedores', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // -- FILTRAR PROVEEDORES -- //
  // Función para filtrar proveedores por nombre o RUT.
  // Se ejecuta al escribir en el campo de búsqueda.
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  // -- AGREGAR PROVEEDOR -- //
  // Función para abrir el modal de agregar proveedor.
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- EDITAR PROVEEDOR -- //
  // Función para abrir el modal de edición de proveedor.
  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier); 
    setEditModalOpen(true); 
  };

  // -- VER PROVEEDOR -- //
  // Función para abrir el modal de ver proveedor.
  const handleViewClick = (supplier) => {
    setSelectedViewSupplier(supplier); 
    setViewModalOpen(true); 
  };

  // -- ELIMINAR PROVEEDOR -- //
  // Función para eliminar un proveedor.
  const handleDeleteClick = (supplier) => {
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
              await axios.delete(`http://localhost:3001/proveedores/${supplier}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              fetchSuppliers(); // Refresca la lista después de eliminar
              Swal.fire({
                title: 'Proveedor eliminado',
                text: 'El proveedor ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            } catch (error) {
              console.error('Error al eliminar el proveedor:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el proveedor.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        });
      }
    });
  };

  // -- CERRAR MODAL DE AGREGAR PROVEEDOR -- //
  // Función para cerrar el modal de agregar proveedor.
  const handleModalClose = () => {
    setModalOpen(false);
    fetchSuppliers();
  };

  // -- CERRAR MODAL DE EDITAR PROVEEDOR -- //
  // Función para cerrar el modal de edición de proveedor.
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchSuppliers();
  };

  // -- CERRAR MODAL DE VER PROVEEDOR -- //
  // Función para cerrar el modal de ver proveedor.
  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}>Proveedores</Typography>
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              label="Buscar por empresa o producto"
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
                <TableCell style={{ width: '100px' }}>Empresa</TableCell>
                <TableCell style={{ width: '150px' }}>Nombre</TableCell>
                <TableCell style={{ width: '100px' }}>Teléfono</TableCell>
                <TableCell style={{ width: '200px' }}>Email</TableCell>
                <TableCell style={{ width: '150px' }}>Dirección</TableCell>
                <TableCell style={{ width: '200px' }}>Productos</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers
                .filter((supplier) => {
                  return supplier.company.toLowerCase().includes(filtro.toLowerCase()) || supplier.provides.toLowerCase().includes(filtro.toLowerCase());
                })
                .map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.company}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>{supplier.provides}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewClick(supplier)} aria-label="Ver" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(supplier)} aria-label="Editar" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(supplier.company)} aria-label="Eliminar" color="error">
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

        <SupplierFormModal open={modalOpen} onClose={handleModalClose} />
        <EditSupplierModal open={editModalOpen} onClose={handleEditModalClose} supplier={selectedSupplier} />
        <ViewSupplierModal open={viewModalOpen} onClose={handleViewModalClose} supplier={selectedViewSupplier} />

    </Grid2>
  );
};

export default Suppliers;