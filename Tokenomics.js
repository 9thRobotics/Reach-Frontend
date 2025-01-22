import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import API_BASE_URL from '../config'; // Adjust the path if necessary

const Tokenomics = () => {
  const [stats, setStats] = useState({ totalSupply: 0, circulatingSupply: 0, price: 0 });
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/token-stats`);
        if (response.data && response.data.history) {
          setStats({
            totalSupply: response.data.totalSupply,
            circulatingSupply: response.data.circulatingSupply,
            price: response.data.price,
          });
          setChartData({
            labels: response.data.history.dates,
            datasets: [
              {
                label: 'Token Price ($)',
                data: response.data.history.prices,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.4,
                fill: false,
              },
            ],
          });
        } else {
          throw new Error('Invalid data format received from the server.');
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError('Failed to load token data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  if (loading) {
    return <p>Loading tokenomics data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Tokenomics</h2>
      <p><strong>Total Supply:</strong> {stats.totalSupply.toLocaleString()}</p>
      <p><strong>Circulating Supply:</strong> {stats.circulatingSupply.toLocaleString()}</p>
      <p><strong>Current Price:</strong> ${stats.price.toFixed(2)}</p>
      <div>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Tokenomics;
