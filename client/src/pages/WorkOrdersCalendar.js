import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Soporte de español para moment
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, Typography } from '@mui/material';

// Configuración de Moment
moment.locale('es');
const localizer = momentLocalizer(moment);

const WorkOrdersCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // Para el evento seleccionado
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/ordenes-de-trabajo', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (!response.ok) {
                    throw new Error('Error al cargar las órdenes de trabajo');
                }
                const data = await response.json();
                const formattedEvents = data.map((order) => ({
                    id: order.id,
                    title: order.descripcion,
                    start: new Date(order.fecha_inicio),
                    end: new Date(order.fecha_termino),
                    clienteRut: formatRUT(order.cliente_rut),
                    vehiculoMatricula: order.matricula_vehiculo,
                    montoTotal: formatAmount(order.monto_total),
                    montoPagado: formatAmount(order.monto_pagado),
                }));
                setEvents(formattedEvents);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchWorkOrders();
    }, []);

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

    // Manejador para seleccionar un evento
    const handleSelectEvent = (event) => {
        setSelectedOrder(event);
    };

    // Cierra el modal
    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid2 container spacing={3} style={{ marginLeft: '240px', marginRight: '200px', padding: '0', height: '100%', display: 'flex' }}>
            <Grid2 item xs={10}>
                <Grid2 container alignItems="center" justifyContent="space-between">
                    <Grid2 item>
                        <Typography variant="h4" style={{ marginBottom: '0px' }}>Calendario de órdenes de trabajo</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 style={{ height: '600px', width: '100%' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%', margin: 'auto' }}
                    views={['month']}
                    defaultView={Views.MONTH}
                    onSelectEvent={handleSelectEvent} // Evento seleccionado
                    messages={{
                        next: "Sig.",
                        previous: "Ant.",
                        today: "Hoy",
                        month: "Mes",
                        noEventsInRange: "No hay eventos en este rango de fechas.",
                    }}
                />

                {/* Modal para mostrar detalles */}
                {selectedOrder && (
                    <Modal
                        open={!!selectedOrder}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                                Detalles de la orden de trabajo - N° {selectedOrder.id}
                            </Typography>
                            <Typography>
                                <strong>RUT cliente:</strong> {selectedOrder.clienteRut}
                            </Typography>
                            <Typography>
                                <strong>Matrícula:</strong> {selectedOrder.vehiculoMatricula}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                <strong>Fecha de inicio:</strong> {new Date(selectedOrder.start).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                <strong>Fecha de término:</strong> {new Date(selectedOrder.end).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                <strong>Descripción:</strong> {selectedOrder.title}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                <strong>Monto total:</strong> ${selectedOrder.montoTotal}
                            </Typography>
                            <Typography>
                                <strong>Monto pagado:</strong> ${selectedOrder.montoPagado}
                            </Typography>
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <button
                                    style={{
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleCloseModal}
                                >
                                    Cerrar
                                </button>
                            </Box>
                        </Box>
                    </Modal>
                )}
            </Grid2>
    </Grid2>
    );
};

export default WorkOrdersCalendar;
