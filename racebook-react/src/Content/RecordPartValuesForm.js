import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './RecordPartValuesForm.css'; // Ensure this path is correct

const RecordPartValuesForm = ({ carId, eventId = null, session }) => {
  const [parts, setParts] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [stagedChanges, setStagedChanges] = useState([]);
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
    loadLocalChanges();
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
      setInitialValues(data.values);
    }
    setLoading(false);
  };

  const loadLocalChanges = () => {
    const savedChanges = JSON.parse(localStorage.getItem(`stagedChanges_${carId}`)) || [];
    setStagedChanges(savedChanges);
    const updatedFormValues = savedChanges.reduce((acc, change) => {
      acc[change.partId] = change.newValue;
      return acc;
    }, {});
    setFormValues((prevValues) => ({
      ...prevValues,
      ...updatedFormValues
    }));
  };

  const saveLocalChanges = (changes) => {
    localStorage.setItem(`stagedChanges_${carId}`, JSON.stringify(changes));
  };

  const handleInputChange = (partId, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [partId]: value,
    }));

    // If it's the first time this setting is changed, add to staged changes
    if (!stagedChanges.some((change) => change.partId === partId)) {
      const newChange = {
        partId,
        partName: parts.find((part) => part.id === partId).name,
        originalValue: initialValues[partId] || '',
        newValue: value,
        unit: parts.find((part) => part.id === partId).unit,
      };
      const updatedChanges = [...stagedChanges, newChange];
      setStagedChanges(updatedChanges);
      saveLocalChanges(updatedChanges);
    } else {
      // Update staged changes with new value
      const updatedChanges = stagedChanges.map((change) =>
        change.partId === partId ? { ...change, newValue: value } : change
      );
      setStagedChanges(updatedChanges);
      saveLocalChanges(updatedChanges);
    }
  };

  const handleUndoChange = (partId) => {
    const originalValue = initialValues[partId];
    setFormValues((prevValues) => ({
      ...prevValues,
      [partId]: originalValue,
    }));

    // Remove from staged changes
    const updatedChanges = stagedChanges.filter((change) => change.partId !== partId);
    setStagedChanges(updatedChanges);
    saveLocalChanges(updatedChanges);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let currentEventId = eventId;
    if (!currentEventId) {
      // Check for existing "garage" event for today
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('id')
        .eq('event_name', 'garage')
        .eq('event_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching garage event:', error);
        return;
      }

      if (data) {
        currentEventId = data.id;
      } else {
        // Create a new garage event
        const { data: newEvent, error: newEventError } = await supabase
          .from('events')
          .insert([
            {
              user_id: session.user.id,
              car_id: carId,
              event_name: 'garage',
              event_date: today,
              event_type: 0,
            },
          ])
          .single();

        if (newEventError) {
          console.error('Error creating garage event:', newEventError);
          return;
        }
        currentEventId = newEvent.id;
      }
    }

    const { data, error } = await supabase
      .from('part_records')
      .insert([
        {
          car_id: carId,
          values: formValues,
          event_id: currentEventId,
        },
      ]);

    if (error) {
      console.error('Error submitting part values:', error);
    } else {
      console.log('Part values submitted:', data);
      setStagedChanges([]);
      localStorage.removeItem(`stagedChanges_${carId}`);
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
      <div className="grid-form">
        {Object.keys(columns).map((column) => (
          <div key={column} className="column">
            {columns[column].map((part) => renderPartInput(part))}
          </div>
        ))}
      </div>
      <div className="staged-changes">
        {stagedChanges.length > 0 ? (
          <ul>
            {stagedChanges.map((change) => (
              <li key={change.partId}>
                {change.partName}: {change.originalValue} {change.unit} -> {change.newValue} {change.unit}
                <button onClick={() => handleUndoChange(change.partId)}>Undo</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No changes staged.</p>
        )}
      </div>
      <div className="button-container">
        <button className="button primary" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default RecordPartValuesForm;
