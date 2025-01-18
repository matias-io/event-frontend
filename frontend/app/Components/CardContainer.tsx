"use client"
import { useEffect, useState } from 'react';
import Card from './Card';

type MarketData = {
  market_type: string;
  region: string;
  primary_exchanges: string;
  local_open: string;
  local_close: string;
  current_status: string;
  notes: string;
};

const API_KEY: string = 'demo'; 
const URL: string = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${API_KEY}`;

const CardContainer = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.markets) {
          setMarkets(data.markets);
        } else {
          setError('Failed to fetch market data.');
        }
      })
      .catch(() => setError('An error occurred while fetching data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
      {markets.map((market, index) => (
        <Card key={index} {...market} />
      ))}
    </div>
  );
};

export default CardContainer;
