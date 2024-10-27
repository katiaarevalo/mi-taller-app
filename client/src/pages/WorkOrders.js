import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Print as PrintIcon } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OrderFormModal from './modals/OrderFormModal';
import ViewOrderModal from './modals/ViewOrderModal';
import EditOrderModal from './modals/EditOrderModal';
/*import ViewFormModal from './modals/ViewFormModal';*/
import { generarPDF } from './pdf/WorkOrderPDF';
import PDFPreviewModal from './modals/PDFPreviewModal';

const WorkOrders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]); // Estado para los clientes
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); 
  const [modalViewOpen, setViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pdfPreviewUri, setPdfPreviewUri] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3001/ordenes-de-trabajo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrdenes(response.data);
    } catch (error) {
      console.error('Error al obtener órdenes de trabajo:', error);
    }
  };

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
    fetchOrdenes();
    fetchClientes(); // Llama a la función para obtener clientes
  }, []);

  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleViewClick = (orden) => {
    setSelectedOrder(orden);
    setViewOpen(true);
  };

  const handleModalViewClose = () => {
    setViewOpen(false);
    fetchOrdenes();
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    fetchOrdenes(); 
  };

  const handlePrintClick = (orden) => {
    const pdfUri = generarPDF(orden); // Llama a la función generarPDF con la orden seleccionada
    setPdfPreviewUri(pdfUri);
    setSelectedOrder(orden);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPdfPreviewUri(null);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // -- EDITAR Orden -- //
  // Función para abrir el modal de edición de cliente.
  const handleEditClick = (orden) => {
    setSelectedOrder(orden); 
    setEditModalOpen(true); 
  };

  // -- CERRAR MODAL DE EDITAR Orden -- //
  // Función para cerrar el modal de edición de orden.
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchOrdenes(); 
  };

//Eliminar Orden

  const deleteOrderF = async (deletewith) =>{
    let confi = window.confirm("¿Confirma la eliminación de la orden?\n\nBorrarlo hará que la información se pierda para siempre\n");
    if (confi) {
      try {
        const token = localStorage.getItem('token');
        console.log(deletewith)
        await axios.delete(`http://localhost:3001/ordenes-de-trabajo/${deletewith}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrdenes(); // Refresca la lista después de eliminar*/
        window.alert("Orden eliminada con éxito");
      } catch (error) {
        window.alert("Error al eliminar orden");
      }
    }
    
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

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const filteredOrdenes = ordenes.filter(orden =>
    orden.matricula_vehiculo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}> Órdenes de trabajo </Typography>
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

      <Grid2 item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', height: '500px'}}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '50px' }}>ID</TableCell>
                <TableCell style={{ width: '100px' }}>Matrícula</TableCell>
                <TableCell style={{ width: '100px' }}>RUT cliente</TableCell>
                <TableCell style={{ width: '100px' }}>Fecha de inicio</TableCell>
                <TableCell style={{ width: '120px' }}>Fecha de término</TableCell>
                <TableCell style={{ width: '100px' }}>Monto total</TableCell>
                <TableCell style={{ width: '100px' }}>Monto pagado</TableCell>
                <TableCell style={{ width: '160px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrdenes.map((orden) => (
                <TableRow key={orden.id}>
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.matricula_vehiculo}</TableCell>
                  <TableCell>{formatRUT(orden.cliente_rut)}</TableCell>
                  <TableCell>{formatDate(orden.fecha_inicio)}</TableCell>
                  <TableCell>{formatDate(orden.fecha_termino)}</TableCell>
                  <TableCell>${formatAmount(orden.monto_total)}</TableCell>
                  <TableCell>${formatAmount(orden.monto_pagado)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewClick(orden)} color="default">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(orden)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() =>deleteOrderF(orden.id)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="info" onClick={() => handlePrintClick(orden)}>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddClick} 
        style={{ position: 'fixed', bottom: '16px', right: '16px' }} 
      >
        <AddIcon />
      </Fab>
      
      <ViewOrderModal 
        open={modalViewOpen} 
        orden={selectedOrder} 
        onClose={handleModalViewClose} 
        clientes={clientes} // Pasa la lista de clientes
      />
      <OrderFormModal open={modalOpen} onClose={handleModalClose} />
      <EditOrderModal open={editModalOpen} onClose={handleEditModalClose} orden={selectedOrder} /> {/* Agrega el modal de edición */}
      <PDFPreviewModal open={isPreviewOpen} onClose={handleClosePreview} pdfUri={pdfPreviewUri} orden={selectedOrder} />

    </Grid2>
  );
};

export default WorkOrders;