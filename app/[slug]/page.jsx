"use client";
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart components (only once, required for Chart.js to work)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Page = () => {
  const { slug } = useParams();
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setData(await response.json());
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCoinData();
  }, [slug]);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${slug}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: '7',
          }
        });
        setChartData({
          labels: response.data.prices.map(price => new Date(price[0]).toLocaleDateString()),
          datasets: [{
            label: 'Price (USD)',
            data: response.data.prices.map(price => price[1]),
            borderColor: 'blue',
            tension: 0.3,
            fill: false
          }]
        });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [slug]);

  return (
    <div className='w-full sm:w-[30rem] sm:mx-auto'>
      {
        loading ? 'Loading...' : (
          <div>
            {
              error ? (<div>
                <p>{error instanceof Error ? error.message : JSON.stringify(error)}</p>
                <Link href='/'>Back to Home</Link>
                </div>
              ) : (
                <div className=''>
                     {chartData?.labels && <Line data={chartData} />}
                    
                  <Link href='/' className='cursor-pointer text-[#3b82f6]'>Back to Home</Link>
                  <p className='mt-2.5'>Market cap: ${data?.market_data?.market_cap?.usd?.toLocaleString()}</p>
                  <p>24h high/low: ${data?.market_data?.high_24h?.usd} / ${data?.market_data?.low_24h?.usd}</p>
                  <p>Total volume: ${data?.market_data?.total_volume?.usd?.toLocaleString()}</p>
                  <p className='mt-4'>Description: {data?.description?.en?.split('. ')[0]}.</p>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Page;

