import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importa el soporte de español para moment
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const WorkOrdersCalendar = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/ordenes-de-trabajo', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token si usas autenticación
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al cargar las órdenes de trabajo');
                }
                const data = await response.json();
                const formattedEvents = data.map((order) => ({
                    title: order.descripcion,
                    start: new Date(order.fecha_inicio),
                    end: new Date(order.fecha_termino),
                }));
                setEvents(formattedEvents);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchWorkOrders();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ height: '100vh', width: '340%' }}>
            <h2 style={{ textAlign: 'center' }}>Calendario de órdenes de trabajo</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
                views={['month']}
                defaultView={Views.MONTH}
                showAllEvents // Muestra todos los eventos directamente
                components={{
                    month: {
                        event: ({ event }) => <div>{event.title}</div>, // Renderiza directamente el título de cada evento
                    },
                }}
                messages={{
                    next: "Sig.",
                    previous: "Ant.",
                    today: "Hoy",
                    month: "Mes",
                    noEventsInRange: "No hay eventos en este rango de fechas.",
                }}
            />
        </div>
    );
};

export default WorkOrdersCalendar;
