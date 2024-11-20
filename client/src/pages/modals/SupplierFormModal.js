import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const SupplierFormModal = ({ open, onClose }) => {
    const [company, setCompany] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [provides, setProvides] = useState('');

    // -- AGREGAR PROVEEDOR -- //
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/proveedores', {
                company,
                name,
                phone,
                email,
                address,
                provides,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Restablecer los datos del formulario
            setCompany('');
            setName('');
            setPhone('');
            setEmail('');
            setAddress('');
            setProvides('');
            onClose(); // Cerrar el modal
            Swal.fire({
                icon: 'success',
                title: 'Proveedor agregado',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error al agregar proveedor:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al agregar proveedor',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2">Agregar proveedor</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Empresa"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Teléfono"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                        label="Correo"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Dirección"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                        label="Productos"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        value={provides}
                        onChange={(e) => setProvides(e.target.value)}
                    />
                    <Box display="flex" justifyContent="space-between" marginTop="16px">
                        <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        sx={{ textTransform: 'none' }} 
                        >
                        Agregar
                        </Button>
                        <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={onClose} 
                        sx={{ textTransform: 'none' }} 
                        >
                        Cerrar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default SupplierFormModal;