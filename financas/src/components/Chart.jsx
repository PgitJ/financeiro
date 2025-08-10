// src/components/Chart.jsx

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ transactions }) => {
  const expensesByCategory = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Despesas',
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Gastos por Categoria',
      },
    },
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default Chart;