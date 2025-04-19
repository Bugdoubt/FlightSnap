import { useState } from 'react';

export default function Home() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setError('');
    setLoading(true);
    setFlights([]);

    try {
      const res = await fetch(`/api/search?from=${departure}&to=${destination}`);
      const data = await res.json();

      if (!data || !Array.isArray(data.results)) {
        throw new Error('Unexpected API response');
      }

      setFlights(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to load flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">FlightSnap: Last-Minute European Deals</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="From (e.g. LON)"
          value={departure}
          onChange={e => setDeparture(e.target.value.toUpperCase())}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="To (e.g. AMS)"
          value={destination}
          onChange={e => setDestination(e.target.value.toUpperCase())}
          className="border p-2 rounded"
        />
      </div>
      <button onClick={searchFlights} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? 'Searching...' : 'Search Flights'}
      </button>

      <div className="mt-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {flights.length === 0 && !error && !loading && <p>No results yet.</p>}
        {flights.length > 0 && (
          <ul className="space-y-4">
            {flights.map((flight, idx) => (
              <li key={idx} className="border rounded p-4">
                <p><strong>{flight.cityFrom}</strong> → <strong>{flight.cityTo}</strong></p>
                <p>Price: £{flight.price}</p>
                <p>Departure: {new Date(flight.dTime * 1000).toLocaleString()}</p>
                <a
                  href={flight.deep_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >View Deal</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
