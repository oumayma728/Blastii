import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusSearch.css';

const BusSearch = () => {
  const [depart, setDepart] = useState('');
  const [arrive, setArrive] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',

  });

  const handleSearch = async (e) => {
    e.preventDefault();

    if (depart === arrive) {
      alert('Departure and arrival locations cannot be the same.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/search_bus?depart=${depart}&arrive=${arrive}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch buses');
      }

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
        setResults([]);
      } else {
        setMessage('');
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      setMessage('An error occurred while searching for buses.');
      setResults([]);
    }
  };

  const handleReserve = (busId) => {
    navigate(`/reserve/${busId}`);
  };

  return (
    <div className="bus-search-container">
      {/* Display today's date */}
      <div className="today-date">
        <h2> {today}</h2>
      </div>

      <h2>Find Available Buses</h2>
      <form id="searchForm" onSubmit={handleSearch}>
        <div>
          <label htmlFor="depart">Departure:</label>
          <select
            id="depart"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            required
          >
            <option value="" disabled>
              Select departure location
            </option>
            <option value="Tunis">Tunis</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Sousse">Sousse</option>
            <option value="Monastir">Monastir</option>
          </select>
        </div>

        <div>
          <label htmlFor="arrive">Arrival:</label>
          <select
            id="arrive"
            value={arrive}
            onChange={(e) => setArrive(e.target.value)}
            required
          >
            <option value="" disabled>
              Select arrival location
            </option>
            <option value="Tunis">Tunis</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Sousse">Sousse</option>
            <option value="Monastir">Monastir</option>
          </select>
        </div>

        <button type="submit">Search</button>
      </form>

      <div id="results">
        {message ? (
          <p>{message}</p>
        ) : (
          results.length > 0 && (
            <div>
              <h3>Buses available:</h3>
              <ul>
                {results.map((bus) => (
                  <li key={bus._id}>
                    <strong>Bus Number:</strong> {bus.busNumber} <br />
                    <strong>Departure:</strong> {bus.depart} <br />
                    <strong>Arrival:</strong> {bus.arrive} <br />
                    <strong>Available Seats:</strong> {bus.availableSeats} <br />
                    <strong>Departure Date:</strong>{' '}
                    {new Date(bus.schedule).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    <br />
                    <button onClick={() => handleReserve(bus._id)}>
                      Reserve this bus
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BusSearch;
