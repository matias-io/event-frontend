"use client";
import { useEffect, useState } from 'react';
import Card from './Card';

// Define the type for event data
type EventData = {
  name: string;
  minPrice: number;
  time: number;
};

const CardContainer = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use dynamic import to load the JSON data
    const loadData = async () => {
      try {
        // Dynamically import the JSON file
        const data = await import('./data.json');
        setEvents(data.default); // Set the event data in state
      } catch (err) {
        setError('An error occurred while importing data.' + {err});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-16">
      <h1 className="text-3xl font-semibold mb-6 text-black">Available Rooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg">
        {events.map((event, index) => (
          <Card key={index} name={event.name} minPrice={event.minPrice} time={event.time} />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
