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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-center font-sans">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">FlightSnap</h1>
      <p className="mb-8 text-gray-600">Find last-minute flight deals across Europe</p>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="From (e.g. LON)"
          value={departure}
          onChange={e => setDeparture(e.target.value.toUpperCase())}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-64"
        />
        <input
          type="text"
          placeholder="To (e.g. AMS)"
          value={destination}
          onChange={e => setDestination(e.target.value.toUpperCase())}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-64"
        />
        <button
          onClick={searchFlights}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {flights.map((flight, idx) => (
          <div key={idx} className="border rounded-lg p-4 text-left shadow hover:shadow-md transition duration-300">
            <div className="text-lg font-semibold mb-1">{flight.cityFrom} → {flight.cityTo}</div>
            <div className="text-gray-700 mb-1">Departure: {formatDate(flight.dTime)}</div>
            <div className="text-gray-900 font-bold text-lg mb-2">Price: £{flight.price}</div>
            <p className="text-sm text-gray-500 italic">
              Use the above details to search this flight on Aviasales or Google Flights.
            </p>
          </div>
        ))}
      </div>

      {flights.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-6">No results yet. Try searching above.</p>
      )}
    </div>
  );
}
