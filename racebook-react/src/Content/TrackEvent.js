import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import RecordPartValuesForm from './RecordPartValuesForm';
import './TrackEvent.css'; // Ensure this path is correct

const TrackEvent = ({ session }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
    } else {
      setEvent(data);
      fetchCar(data.car_id);
    }
  };

  const fetchCar = async (carId) => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();

    if (error) {
      console.error('Error fetching car:', error);
    } else {
      setCar(data);
    }
  };

  if (!event) {
    return <div>Loading event...</div>;
  }

  return (
    <div className="track-event">
      {event && (
        <div>
          <h2>Event: {event.event_name}</h2>
          <p>Track: {event.track_name}</p>
          <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
          <p>Car: {car && car.name}</p>
        </div>
      )}
      <RecordPartValuesForm carId={event.car_id} eventId={event.id} />
    </div>
  );
};

export default TrackEvent;
