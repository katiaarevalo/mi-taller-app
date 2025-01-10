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

        // Filtrar y procesar los datos para eliminar duplicados y validar meses
        const datosProcesados = response.data
          .filter(item => item.mes >= 1 && item.mes <= 12) // Validar meses
          .reduce((acc, item) => {
            const existing = acc.find(d => d.mes === item.mes);
            if (existing) {
              existing.cantidad += item.cantidad; // Sumar cantidades si el mes ya existe
            } else {
              acc.push(item); // Agregar nuevo mes
            }
            return acc;
          }, []);

        setOrdenesPorMes(datosProcesados);
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
          maxRotation: 45,  
          minRotation: 45, 
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '800px',
        height: '410px',
        padding: '5px', 
        boxSizing: 'border-box', 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px', 
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