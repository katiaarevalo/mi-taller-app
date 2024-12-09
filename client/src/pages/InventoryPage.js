// pages/InventoryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import InventoryIcon from '@mui/icons-material/Inventory';
import Swal from 'sweetalert2';
import InventoryFormModal from './modals/InventoryFormModal'; 
import EditInventoryModal from './modals/EditInventoryModal'; 
import ViewInventoryModal from './modals/ViewInventoryModal'; 

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState(null);

  // -- OBTENER LISTA DE ARTÍCULOS -- //
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/Inventario', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error al obtener artículos:', error);
    }
  };

  useEffect(() => { 
    fetchItems();
  }, []);

  // -- FILTRAR ARTÍCULOS -- //
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // -- AGREGAR ARTÍCULO -- //
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- EDITAR ARTÍCULO -- //
  const handleEditClick = (item) => {
    setSelectedItem(item); 
    setEditModalOpen(true); 
  };

  // -- VER ARTÍCULO -- //
  const handleViewClick = (item) => {
    setSelectedViewItem(item); 
    setViewModalOpen(true); 
  };

  // -- ELIMINAR ARTÍCULO -- //
  const handleDeleteClick = (item) => {
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
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3001/inventario/${item.id}`, { 
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchItems(); 
          Swal.fire({
            title: 'Artículo eliminado',
            text: 'El artículo ha sido eliminado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } catch (error) {
          console.error('Error al eliminar el artículo:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar el artículo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    });
  };

  // -- CERRAR MODAL DE AGREGAR ARTÍCULO -- //
  const handleModalClose = () => {
    setModalOpen(false);
    fetchItems();
  };

  // -- CERRAR MODAL DE EDITAR ARTÍCULO -- //
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchItems();
  };

  // -- CERRAR MODAL DE VER ARTÍCULO -- //
  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  return (
    <Grid container spacing={3} style={{ paddingLeft: '0px', paddingTop: '16px' }}>
      <Grid item xs={10}>
        <Typography variant="h4" style={{ marginBottom: '0px' }}>Inventario</Typography>
        <TextField
          label="Buscar por nombre o producto"
          variant="outlined"
          style={{ width: '250px' }}
          value={filter}
          margin='dense'
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InventoryIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', height: '500px' }}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '150px' }}>Nombre</TableCell>
                <TableCell style={{ width: '100px' }}>Cantidad</TableCell>
                <TableCell style={{ width: '200px' }}>Descripción</TableCell>
                <TableCell style={{ width: '150px' }}>Categoría</TableCell> {/* Nueva columna para categoría */}
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .filter((item) => item.nombre.toLowerCase().includes(filter.toLowerCase()) 
                || item.descripcion.toLowerCase().includes(filter.toLowerCase())
                ||item.descripcion.toLowerCase().includes(filter.toLowerCase))
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>{item.categoria}</TableCell> {/* Mostrar categoría */}
                    <TableCell>
                      <IconButton onClick={() => handleViewClick(item)} aria-label="Ver" color="default">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(item)} aria-label="Editar" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(item)} aria-label="Eliminar" color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botón para agregar artículo */}
        <Fab color="primary" onClick={handleAddClick} style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
        {/* Modales */}
        {modalOpen && (
          <InventoryFormModal open={modalOpen} onClose={handleModalClose} onAdd={(newItem) => {/* lógica para agregar */}} />
        )}
        {editModalOpen && (
          <EditInventoryModal open={editModalOpen} onClose={handleEditModalClose} item={selectedItem} />
        )}
        {viewModalOpen && (
          <ViewInventoryModal open={viewModalOpen} onClose={handleViewModalClose} item={selectedViewItem} />
        )}
      </Grid>
    </Grid>
  );
};

export default Inventory;
