import React, { useState, useEffect } from 'react';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', fecha: '', descripcion: '' });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3001/reservas', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Error al obtener las reservas:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
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
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) fetchReservations();
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
        }
    };

    return (
        <div>
            <h2>Reservas</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                />
                <input
                    type="datetime-local"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                ></textarea>
                <button type="submit">Agregar Reserva</button>
            </form>

            <ul>
                {reservations.map((res) => (
                    <li key={res.id}>
                        <p><strong>Nombre:</strong> {res.nombre}</p>
                        <p><strong>Fecha:</strong> {new Date(res.fecha).toLocaleString()}</p>
                        <p><strong>Descripción:</strong> {res.descripcion}</p>
                        <button onClick={() => handleDelete(res.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservations;
