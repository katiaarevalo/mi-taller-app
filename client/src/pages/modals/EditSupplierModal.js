import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
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

const EditSupplierModal = ({ open, onClose, supplier }) => {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        provides: '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData(supplier); // Rellena el formulario con los datos del proveedor seleccionado
        }
    }, [supplier]);

    // -- MANEJAR CAMBIOS EN LOS INPUTS -- //
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // -- ACTUALIZAR PROVEEDOR -- //
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/proveedores/${formData.company}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({
                title: 'Proveedor editado',
                text: 'El proveedor ha sido editado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            onClose();
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al editar el proveedor.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component={"h2"}>Editar datos de proveedor</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="company"
                        label="Empresa"
                        value={formData.company}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                        disabled
                    />
                    <TextField
                        name="name"
                        label="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                    />
                    <TextField
                        name="phone"
                        label="Teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                    />
                    <TextField
                        name="email"
                        label="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                    />
                    <TextField
                        name="address"
                        label="Dirección"
                        value={formData.address}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                    />
                    <TextField
                        name="provides"
                        label="Productos/Servicios"
                        value={formData.provides}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant='outlined'
                    />
                    <Box display="flex" justifyContent="space-between" marginTop="16px">
                        <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                        Guardar
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
}

export default EditSupplierModal;