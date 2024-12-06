    // src/modals/InventoryFormModal.js
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

    const InventoryFormModal = ({ open, onClose }) => {
        const [nombre, setNombre] = useState('');
        const [cantidad, setCantidad] = useState('');
        const [descripcion, setDescripcion] = useState('');
        const [categoria, setCategoria] = useState(''); // Nuevo estado para categoría

        // -- AGREGAR ARTÍCULO -- //
        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:3001/Inventario', {
                    nombre,
                    cantidad,
                    descripcion,
                    categoria, // Agregar la categoría al envío de datos
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Restablecer los datos del formulario
                setNombre('');
                setCantidad(0);
                setDescripcion('');
                setCategoria(''); // Restablecer categoría
                onClose(); // Cerrar el modal
                Swal.fire({
                    icon: 'success',
                    title: 'Artículo agregado',
                    text: 'El artículo ha sido agregado correctamente',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                console.error('Error al agregar artículo:', error);
                onClose(); // Cerrar el modal
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al agregar el artículo',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        return (
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">Agregar Artículo</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <TextField
                            label="Cantidad"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                        <TextField
                            label="Descripción"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                        <TextField
                            label="Categoría" // Nuevo campo de categoría
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)} // Actualiza el estado de categoría
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

    export default InventoryFormModal;
