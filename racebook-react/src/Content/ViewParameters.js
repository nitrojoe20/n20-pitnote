import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './RecordPartValuesForm.css'; // Ensure this path is correct

const RecordPartValuesForm = ({ carId }) => {
  const [parts, setParts] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);

  const layout = {
    "Extra (Above)": "center",
    "LF": "left",
    "Engine": "center",
    "RF": "right",
    "Center": "center",
    "LR": "left",
    "Rear End": "center",
    "RR": "right",
    "Extra (Below)": "center"
  };

  useEffect(() => {
    fetchParts();
    fetchLatestRecord();
  }, [carId]);

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .eq('car_id', carId);

    if (error) {
      console.error('Error fetching parts:', error);
    } else {
      setParts(data);
    }
  };

  const fetchLatestRecord = async () => {
    const { data, error } = await supabase
      .from('part_records')
      .select('values')
      .eq('car_id', carId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest record:', error);
    } else if (data) {
      setFormValues(data.values);
    }
    setLoading(false);
  };

  const handleInputChange = (partId, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [partId]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('part_records')
      .insert([
        {
          car_id: carId,
          values: formValues,
        },
      ]);

    if (error) {
      console.error('Error submitting part values:', error);
    } else {
      console.log('Part values submitted:', data);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderPartInput = (part) => (
    <div key={part.id}>
      <label>
        {part.name} ({part.unit}):
        {part.entry_type === 'number' ? (
          <input
            type="number"
            value={formValues[part.id] || ''}
            onChange={(e) => handleInputChange(part.id, e.target.value)}
          />
        ) : (
          <input
            type="text"
            value={formValues[part.id] || ''}
            onChange={(e) => handleInputChange(part.id, e.target.value)}
          />
        )}
      </label>
    </div>
  );

  const columns = {
    left: [],
    center: [],
    right: []
  };

  parts.forEach((part) => {
    const column = layout[part.corner];
    if (column) {
      columns[column].push(part);
    }
  });

  return (
    <div>
      <h2>Record Part Values</h2>
      <form onSubmit={handleSubmit} className="grid-form">
        {Object.keys(columns).map((column) => (
          <div key={column} className="column">
            {columns[column].map((part) => renderPartInput(part))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RecordPartValuesForm;
