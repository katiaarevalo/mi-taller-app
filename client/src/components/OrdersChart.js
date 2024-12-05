import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart = () => {
  const [ordenesPorMes, setOrdenesPorMes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Array de nombres de los meses
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 
    'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    const fetchOrdenesPorMes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ordenes-de-trabajo/estadisticas/ordenes-por-mes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrdenesPorMes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener órdenes por mes:', error);
        setLoading(false);
      }
    };

    fetchOrdenesPorMes();
  }, []);

  const chartData = {
    labels: ordenesPorMes.map((item) => meses[item.mes - 1]), // Usar el número de mes para obtener el nombre
    datasets: [
      {
        label: 'Órdenes de trabajo',
        data: ordenesPorMes.map((item) => item.cantidad),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carga de trabajo por mes',
        font: {
          weight: 'bold',
        },
      },
    },
      scales: {
        x: {
          ticks: {
            // Ajustar el ángulo de los nombres de los meses
            maxRotation: 45,  // Máximo ángulo de rotación
            minRotation: 45,  // Mínimo ángulo de rotación
          },
        },
      },
    };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '10px', // Espaciado más generoso
        boxSizing: 'border-box', // Asegúrate de que el padding no afecte el tamaño total
        backgroundColor: '#fff', // Fondo blanco limpio
        borderRadius: '12px', // Bordes más redondeados
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Sombra suave
        marginBottom: '20px', // Separación inferior
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading ? (
        <div style={{ fontSize: '18px', color: '#888' }}>Cargando datos...</div>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default OrdersChart;