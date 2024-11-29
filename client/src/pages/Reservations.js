import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    TextareaAutosize,
    Typography,
    Container,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', fecha: '', descripcion: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3001/reservas', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();

            // Ordenar las reservas por fecha más próxima
            const sortedReservations = data.sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );
            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error al obtener las reservas:', error);
        }
    };

    const validateName = (name) =>
        /^[a-zA-Z\s]+$/.test(name.trim()) && name.trim().length > 0; // Solo letras, no vacío
    const validateDate = (date) => new Date(date) >= new Date(); // Fecha >= hoy

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateName(formData.nombre)) {
            setError('El nombre solo puede contener letras, no estar vacío ni tener solo espacios.');
            return;
        }

        if (!validateDate(formData.fecha)) {
            setError('La fecha no puede ser anterior al día actual.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchReservations();
                setFormData({ nombre: '', fecha: '', descripcion: '' });
            }
        } catch (error) {
            console.error('Error al agregar la reserva:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/reservas/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) fetchReservations();
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Reservas
            </Typography>

            {/* Muestra el error si existe */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Formulario */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 4,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: '#f9f9f9',
                }}
            >
                <TextField
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    error={formData.nombre && !validateName(formData.nombre)}
                    helperText={
                        formData.nombre && !validateName(formData.nombre)
                            ? 'El nombre solo puede contener letras, no estar vacío ni tener solo espacios.'
                            : ''
                    }
                />
                <TextField
                    label="Fecha"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                    error={formData.fecha && !validateDate(formData.fecha)}
                    helperText={
                        formData.fecha && !validateDate(formData.fecha)
                            ? 'La fecha no puede ser anterior al día actual.'
                            : ''
                    }
                />
                <TextareaAutosize
                    minRows={4}
                    placeholder="Descripción"
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        borderColor: '#ccc',
                        borderRadius: '4px',
                    }}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
                <Button type="submit" variant="contained" color="primary">
                    Agregar Reserva
                </Button>
            </Box>

            {/* Lista de Reservas */}
            <List>
                {reservations.map((res) => (
                    <React.Fragment key={res.id}>
                        <ListItem
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                                mb: 1,
                                p: 2,
                                boxShadow: 1,
                            }}
                        >
                            <ListItemText
                                primary={
                                    <>
                                        <Typography variant="h6" component="span">
                                            {res.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(res.fecha).toLocaleString()}
                                        </Typography>
                                    </>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {res.descripcion}
                                    </Typography>
                                }
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(res.id)}
                            >
                                Eliminar
                            </Button>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
};

export default Reservations;
