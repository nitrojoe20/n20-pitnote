import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

function CreateParameterForm({ partId, onParameterCreated }) {
  const [parameterName, setParameterName] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('number');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('part_parameters')
      .insert([{ part_id: partId, name: parameterName, unit, type }]);

    if (error) {
      console.error('Error creating parameter:', error);
    } else {
      console.log('Parameter created:', data);
      onParameterCreated(); // Callback to refresh the parameter list
    }
  };

  return (
    <div>
      <h2>Create a Parameter</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Parameter Name:
          <input
            type="text"
            value={parameterName}
            onChange={(e) => setParameterName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Unit:
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </label>
        <br />
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="number">Number</option>
            <option value="text">Text</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </label>
        <br />
        <button type="submit">Create Parameter</button>
      </form>
    </div>
  );
}

export default CreateParameterForm;
