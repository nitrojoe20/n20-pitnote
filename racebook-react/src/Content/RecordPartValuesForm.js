import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './RecordPartValuesForm.css'; // Ensure this path is correct

const RecordPartValuesForm = ({ carId }) => {
  const [parts, setParts] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);

  const layout = {
    "Extra (Above)": { row: 1, col: 2 },
    "LF": { row: 2, col: 1 },
    "Engine": { row: 2, col: 2 },
    "RF": { row: 2, col: 3 },
    "Center": { row: 3, col: 2 },
    "LR": { row: 4, col: 1 },
    "Rear End": { row: 4, col: 2 },
    "RR": { row: 4, col: 3 },
    "Extra (Below)": { row: 5, col: 2 }
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

  return (
    <div>
      <h2>Record Part Values</h2>
      <form onSubmit={handleSubmit} className="grid-form">
        {Object.entries(layout).map(([corner, { row, col }]) => (
          <div key={corner} className={`row-${row} col-${col}`}>
            {parts
              .filter((part) => part.corner === corner)
              .map((part) => renderPartInput(part))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RecordPartValuesForm;
