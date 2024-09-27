import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VehicleFormModal from './modals/VehicleFormModal';
import ViewVehicleModal from './modals/ViewVehicleModal';


const Vehicles = () => {
  const [autos, setAutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [historialData, setHistorialData] = useState([]);
  const [selectedAuto, setSelectedAuto] = useState(null);

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

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchAutos(); // Volver a cargar los autos tras cerrar el modal
  };

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

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setHistorialData([]);
    setSelectedAuto(null);
  };

  const filteredAutos = autos.filter(auto =>
    auto.matricula.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '0px', padding: '0', height: '100%', width:'1050px', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}> Vehículos </Typography>
          </Grid2>
          <Grid2 item>
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
                <TableCell style={{ width: '100px' }}>RUT Cliente Actual</TableCell>
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
                    <IconButton onClick={() => handleViewClick(auto)} sx={{ '&:hover': { backgroundColor: '#008AB4' } }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton sx={{ '&:hover': { backgroundColor: '#008AB4' } }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ '&:hover': { backgroundColor: '#008AB4' } }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      {/* Botón para agregar nuevo auto */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddClick} 
        style={{ position: 'fixed', bottom: '16px', right: '16px' }} 
      >
        <AddIcon />
      </Fab>

      {/* Modal para agregar nuevo auto */}
      <VehicleFormModal open={modalOpen} onClose={handleModalClose} />

      {/* Modal para mostrar los detalles del vehículo y el historial de propietarios */}
      <ViewVehicleModal 
        open={viewModalOpen} 
        onClose={handleViewModalClose} 
        auto={selectedAuto} 
        historialData={historialData} 
      />
    </Grid2>
  );
};

export default Vehicles;