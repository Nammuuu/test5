

"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import styles from "../../../styles/admin/Graph.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ chartData }) => {
  const data = {
    // labels: ['Users', 'Products', 'Orders', 'Categories', 'totalViewsCount'],
    labels: ['Users', 'Products', 'Orders', 'Categories', ],
    datasets: [
      {
        label: 'Totals',
        data: chartData,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.9)',
          'rgba(255, 99, 132, 0.9)',
          'rgba(54, 162, 235, 0.9)',
          'rgba(255, 206, 86, 0.9)',
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dashboard Overview',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphWrapper}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Graph;







