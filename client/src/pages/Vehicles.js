import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VehicleFormModal from './modals/VehicleFormModal';
import ViewVehicleModal from './modals/ViewVehicleModal';
import EditVehicleModal from './modals/EditVehicleModal'; 

const Vehicles = () => {
  const [autos, setAutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); 
  const [historialData, setHistorialData] = useState([]);
  const [selectedAuto, setSelectedAuto] = useState(null); 

  // -- OBTENER LISTA DE AUTOS -- // 
  // Función para obtener la lista de autos. 
  // Se ejecuta al cargar la página y al cerrar el modal de agregar auto.
  const fetchAutos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/autos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutos(response.data);
    } catch (error) {
      console.error('Error al obtener autos:', error);
    }
  };

  useEffect(() => {
    fetchAutos();
  }, []);

  // -- FILTRAR AUTOS -- //
  // Función para filtrar autos por matrícula.
  // Se ejecuta al escribir en el campo de búsqueda.
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  // -- AGREGAR AUTO -- //
  // Función para abrir el modal de agregar auto.
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- CERRAR MODAL DE AGREGAR AUTO -- //
  // Función para cerrar el modal de agregar auto.
  // Refresca la lista de autos.
  const handleModalClose = () => {
    setModalOpen(false);
    fetchAutos(); 
  };

  // -- VER HISTORIAL DE PROPIETARIOS -- //
  // Función para obtener el historial de propietarios de un auto.
  // Guarda el auto seleccionado y abre el modal.
  const handleViewClick = async (auto) => {
    setSelectedAuto(auto);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3001/autos/${auto.matricula}/historial`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorialData(response.data);
      setViewModalOpen(true);
    } catch (error) {
      console.error('Error al obtener historial de propietarios:', error);
    }
  };

  // -- ELIMINAR AUTO -- //
  // Función para eliminar un auto.
  // Pide confirmación antes de eliminar.
  // Refresca la lista de autos después de eliminar.
  const handleDelete = async (matricula) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este vehículo?");
    if (confirmDelete) {
      const confirmDeleteFinal = window.confirm("Esta acción no se puede deshacer. ¿Confirmas la eliminación?");
      if (confirmDeleteFinal) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3001/autos/${matricula}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchAutos(); 
        } catch (error) {
          console.error('Error al eliminar el vehículo:', error);
        }
      }
    }
  };

  // -- EDITAR AUTO -- //
  // Función para abrir el modal de edición de un auto.
  // Guarda el auto seleccionado y abre el modal.
  const handleEditClick = (auto) => {
    setSelectedAuto(auto); 
    setEditModalOpen(true); 
  };

  // -- CERRAR MODAL DE EDICIÓN -- //
  // Función para cerrar el modal de edición de un auto.
  // Refresca la lista de autos después de editar.
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchAutos(); 
  };

  // -- CERRAR MODAL DE VER DETALLES -- //
  // Función para cerrar el modal de ver detalles de un auto.
  // Limpia los datos del auto y el historial.
  // Se ejecuta al cerrar el modal.
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setHistorialData([]);
    setSelectedAuto(null);
  };

  // -- RENDERIZADO -- //
  // Filtra los autos según el texto ingresado en el campo de búsqueda.
  // Muestra la tabla de autos con las acciones de ver, editar y eliminar.
  const filteredAutos = autos.filter(auto =>
    auto.matricula.toLowerCase().includes(filtro.toLowerCase())
  );

  // Renderiza la página de vehículos.
  return (
    <Grid2 container spacing={3} style={{ marginLeft: '0px', padding: '0', height: '100%', width:'1050px', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}> Vehículos </Typography>
          </Grid2>
          <Grid2 item>
            {/* -- BARRA DE BÚSQUEDA. -- */}
            <TextField
              label="Buscar por matrícula"
              variant="outlined"
              style={{ width: '250px' }}
              margin="dense"
              value={filtro}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Tabla */}
      <Grid2 item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', height: '500px' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '100px' }}>Matrícula</TableCell>
                <TableCell style={{ width: '100px' }}>RUT cliente actual</TableCell>
                <TableCell style={{ width: '100px' }}>Color</TableCell>
                <TableCell style={{ width: '150px' }}>Descripción</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAutos.map((auto) => (
                <TableRow key={auto.id}>
                  <TableCell>{auto.matricula}</TableCell>
                  <TableCell>{auto.cliente_actual}</TableCell>
                  <TableCell>{auto.color}</TableCell>
                  <TableCell>{auto.descripcion}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewClick(auto)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(auto)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(auto.matricula)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      {/* -- BOTÓN DE AGREGAR -- */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddClick} 
        style={{ position: 'fixed', bottom: '16px', right: '16px' }} 
      >
        <AddIcon />
      </Fab>

      {/* -- ABRIR MODAL AGREGAR --*/}
      <VehicleFormModal open={modalOpen} onClose={handleModalClose} />

      {/* -- MODAL VISUALIZAR DATOS -- */}
      <ViewVehicleModal 
        open={viewModalOpen} 
        onClose={handleViewModalClose} 
        auto={selectedAuto} 
        historialData={historialData} 
      />

      {/* -- MODAL EDITAR DATOS -- */}
      <EditVehicleModal 
        open={editModalOpen} 
        onClose={handleEditModalClose} 
        vehicle={selectedAuto}
      />
    </Grid2>
  );
};

export default Vehicles;