import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importa el soporte de español para moment
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configura Moment para usar el idioma español
moment.locale('es');
const localizer = momentLocalizer(moment);

const WorkOrdersCalendar = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/ordenes-de-trabajo', { // si fala cambia la rita del local...
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
                    end: new Date(order.fecha_termino)
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
        <div>
            <h2>Calendario de órdenes de trabajo</h2>
            {events.length === 0 ? (
                <p>No hay órdenes de trabajo para mostrar en el calendario.</p>
            ) : (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    messages={{
                        next: "Sig.",
                        previous: "Ant.",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "No hay eventos en este rango de fechas.",
                        showMore: total => `+ Ver más (${total})`
                    }}
                />
            )}
        </div>
    );
};

export default WorkOrdersCalendar;
