import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid2 } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Typography, InputAdornment, Fab } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EditAccountPayableModal from './modals/EditAccountPayableModal';
import AccountPayableModal from "./modals/AccountPayableModal";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Swal from 'sweetalert2';

const Vehicles = () => {
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  //const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); 
  //const [historialData, setHistorialData] = useState([]);
  const [Today, setToday]=useState(''); // eslint-disable-line no-unused-vars


  // VARIABLES CUENTAS POR PAGAR //

  // Datos de las cuentas por pagar traidas desde la base de datos
  const [Cuentas, setCuentas] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); 

  
  
  // -- OBTENER LISTA DE CUENTAS POR PAGAR -- // 
  // Función para obtener la lista de autos. 
  // Se ejecuta al cargar la página y al cerrar el modal de agregar auto.
  const fetchCuentas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/account-payable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener autos:', error);
    }
  };
  
  useEffect(() => {
    fetchCuentas()
    var f = new Date();
    setToday(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
    

  }, []);

  // -- FILTRAR CUENTAS -- //
  // Función para filtrar autos por matrícula.
  // Se ejecuta al escribir en el campo de búsqueda.
  const handleFilterChange = (e) => {
    setFiltro(e.target.value);
  };

  // -- AGREGAR CUENTA -- //
  // Función para abrir el modal de agregar una cuenta por pagar.
  const handleAddClick = () => {
    setModalOpen(true);
  };

  // -- CERRAR MODAL DE AGREGAR AUTO -- //
  // Función para cerrar el modal de agregar auto.
  // Refresca la lista de autos.
  const handleModalClose = () => {
    setModalOpen(false);
    fetchCuentas(); 
  };

  









  // -- ELIMINAR CUENTAS -- //
  // Función para eliminar una cuenta por pagar.
  // Pide confirmación antes de eliminar.
  // Refresca la lista de autos después de eliminar.
  const handleDeleteAccountPayable = async (idCuenta) => {
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
              await axios.delete(`http://localhost:3001/account-payable/${idCuenta}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              fetchCuentas(); // Refresca la lista después de eliminar
              Swal.fire({
                title: 'Cuenta eliminada',
                text: 'La cuenta ha sido eliminada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            } catch (error) {
              console.error('Error al eliminar el cuenta:', error);
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la cuenta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }
        }
    )}
    });
  };





  // -- EDITAR CUENTA -- //
  // Función para abrir el modal de edición de un cuenta.
  // Guarda la cuenta seleccionado y abre el modal.
  const handleEditClick = (Cuenta) => {
    setSelectedAccount(Cuenta); 
    setEditModalOpen(true); 
  };

  // -- CERRAR MODAL DE EDICIÓN -- //
  // Función para cerrar el modal de edición de una cuenta.
  // Refresca la lista de cuentas después de editar.
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    fetchCuentas(); 
  };




  // -- RENDERIZADO -- //
  // Filtra los cuentas según el texto ingresado en el campo de búsqueda.
  // Muestra la tabla de autos con las acciones de ver, editar y eliminar.
  const filteredAccountPayable = Cuentas.filter(Cuentas =>
    Cuentas.State.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };


  // -- ESTADO DE FECHA -- //
  // Se revisa el estado del servicio,
  // Si esta por pagar 1
  // Si esta pagado 0
  


  // Renderiza la página de vehículos.
  return (
    <Grid2 container spacing={3} style={{ marginLeft: '240px', padding: '0', height: '100%', width:'1050px', display: 'flex', flexDirection: 'column' }}>
      <Grid2 item xs={10}>
        <Grid2 container alignItems="center" justifyContent="space-between">
          <Grid2 item>
            <Typography variant="h4" style={{ marginBottom: '0px' }}> Cuentas por pagar </Typography>
          </Grid2>
          <Grid2 item>
            {/* -- BARRA DE BÚSQUEDA. -- */} {/* Considerar eliminar */}
            <TextField
              label="Buscar por servicio"
              variant="outlined"
              style={{ width: '250px' }}
              margin="dense"
              value={filtro}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RequestQuoteIcon />
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
                <TableCell style={{ width: '100px' }}>Servicio</TableCell>
                <TableCell style={{ width: '100px' }}>Compañía</TableCell>
                <TableCell style={{ width: '100px' }}>Fecha límite</TableCell>
                <TableCell style={{ width: '150px' }}>Monto</TableCell>
                <TableCell style={{ width: '150px' }}>Estado</TableCell>
                <TableCell style={{ width: '150px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccountPayable.map((Cuentas) => (
                <TableRow key={Cuentas.id}>
                  <TableCell>{Cuentas.Services}</TableCell>
                  <TableCell>{Cuentas.Company}</TableCell>
                  <TableCell>{Cuentas.Deadline}</TableCell>                  
                  <TableCell>${formatAmount(Cuentas.Amount)}</TableCell>
                  <TableCell>{Cuentas.State}</TableCell> {/*Implementar funcion que cambie el estado*/}

                  <TableCell>

                    <IconButton onClick={() => handleEditClick(Cuentas)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAccountPayable(Cuentas.id)} color="secondary">
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
      <AccountPayableModal open={modalOpen} onClose={handleModalClose} />


      {/* -- MODAL EDITAR DATOS -- */}
      <EditAccountPayableModal 
        open={editModalOpen} 
        onClose={handleEditModalClose} 
        AccountData={selectedAccount}
      />
    </Grid2>
  );
};

export default Vehicles;