// src/modals/EditInventoryModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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

const EditInventoryModal = ({ open, onClose, item }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cantidad: 0,
        descripcion: '',
        categoria: '' // Agregar categoría en el estado
    });
    const [categoria, setCategoria] = useState(''); 

    // Cargar los datos del artículo seleccionado en el formulario
    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/Inventario/${item.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Artículo actualizado',
                text: 'El artículo ha sido actualizado correctamente',
                confirmButtonText: 'Aceptar'
            });
            onClose(); // Cerrar modal después de actualizar
        } catch (error) {
            console.error('Error al actualizar el artículo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al actualizar el artículo',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Editar Artículo</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        label="Nombre" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                        margin="normal"
                    />
                    <TextField 
                        label="Cantidad" 
                        name="cantidad" 
                        type="number" 
                        value={formData.cantidad} 
                        onChange={handleChange} 
                        required 
                        fullWidth 
                        margin="normal"
                    />
                    <TextField 
                        label="Descripción" 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel id="categoria-label">Categoría</InputLabel>
                            <Select
                                labelId="categoria-label"
                                name="categoria"
                                value={categoria} // Estado actual de la categoría
                                onChange={(e) => setCategoria(e.target.value)} // Actualiza el estado de la categoría
                                label="Categoría"
                                required
                            >
                                <MenuItem value="Repuestos y piezas">Repuestos y piezas</MenuItem>
                                <MenuItem value="Herramientas">Herramientas</MenuItem>
                                <MenuItem value="Equipos de Seguridad y Protección">Equipos de Seguridad y Protección</MenuItem>
                                <MenuItem value="Suministros de Mantenimiento">Suministros de Mantenimiento</MenuItem>
                                <MenuItem value="Productos Químicos">Productos Químicos</MenuItem>
                                <MenuItem value="Equipos Especializados">Equipos Especializados</MenuItem>
                                <MenuItem value="Materiales de Oficina">Materiales de Oficina</MenuItem>
                            </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button sx={{textTransform: 'none'}} type="submit" variant="contained" color="primary">
                            Actualizar
                        </Button>
                        <Button sx={{textTransform: 'none'}} type="button" variant="outlined" color="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};
export default EditInventoryModal;
