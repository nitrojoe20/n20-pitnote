import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './TrackMode.css';

const TrackMode = ({ session }) => {
  const navigate = useNavigate();
  const [trackName, setTrackName] = useState('');
  const [carId, setCarId] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [cars, setCars] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchCars();
    fetchEvents();
  }, []);

  useEffect(() => {
    const savedCarId = localStorage.getItem('selectedCarId');
    if (savedCarId) {
      setCarId(savedCarId);
    }
  }, [cars]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .order('event_date', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          user_id: session.user.id,
          track_name: trackName,
          car_id: carId,
          event_name: eventName,
          event_date: eventDate,
        },
      ]);

    if (error) {
      console.error('Error creating event:', error);
    } else {
      console.log('Event created:', data);
      navigate(`/track-event/${data[0].event_id}`);
    }
  };

  const handleContinueEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleConfirmContinue = () => {
    navigate(`/track-event/${selectedEvent.event_id}`);
  };

  return (
    <div className="track-mode">
      <h2>Track Mode</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Track Name:
          <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} required />
        </label>
        <br />
        <label>
          Car:
          <select value={carId} onChange={(e) => setCarId(e.target.value)} required>
            <option value="" disabled>Select a car</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Event Name:
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Start Event</button>
      </form>
      <h3>Continue?</h3>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Track</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.event_id}>
              <td>{event.event_name}</td>
              <td>{event.track_name}</td>
              <td>{new Date(event.event_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleContinueEvent(event)}>Continue</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && (
        <div className="confirmation-dialog">
          <p>Would you like to continue: "{selectedEvent.event_name}", at "{selectedEvent.track_name}" on "{new Date(selectedEvent.event_date).toLocaleDateString()}"?</p>
          <button onClick={handleConfirmContinue}>Yes</button>
          <button onClick={() => setSelectedEvent(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default TrackMode;
