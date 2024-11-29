import React, { useState, useEffect } from 'react';
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
                    clienteRut: order.cliente_rut,
                    clienteNombre: order.cliente_nombre,
                    vehiculoMatricula: order.matricula_vehiculo,
                    montoTotal: order.monto_total,
                    montoPagado: order.monto_pagado,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchWorkOrders();
    }, []);

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
        <div style={{ height: '110vh', width: '400%' }}>
            <h2 style={{ textAlign: 'center' }}>Calendario de órdenes de trabajo</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '80%', margin: 'auto' }}
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
                            <strong>RUT Cliente:</strong> {selectedOrder.clienteRut}
                        </Typography>
                        <Typography>
                            <strong>Nombre Cliente:</strong> {selectedOrder.clienteNombre}
                        </Typography>
                        <Typography>
                            <strong>Matrícula:</strong> {selectedOrder.vehiculoMatricula}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Fecha de Inicio:</strong> {new Date(selectedOrder.start).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            <strong>Fecha de Término:</strong> {new Date(selectedOrder.end).toLocaleDateString()}
                        </Typography>
                        <Typography>
                            <strong>Descripción:</strong> {selectedOrder.title}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Monto Total:</strong> ${selectedOrder.montoTotal}
                        </Typography>
                        <Typography>
                            <strong>Monto Pagado:</strong> ${selectedOrder.montoPagado}
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
        </div>
    );
};

export default WorkOrdersCalendar;
