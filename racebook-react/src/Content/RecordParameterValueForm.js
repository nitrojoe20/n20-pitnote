import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

function RecordParameterValueForm({ partParameterId, onValueRecorded }) {
  const [value, setValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('parameter_values')
      .insert([{ part_parameter_id: partParameterId, value }]);

    if (error) {
      console.error('Error recording parameter value:', error);
    } else {
      console.log('Parameter value recorded:', data);
      onValueRecorded(); // Callback to refresh the values list
    }
  };

  return (
    <div>
      <h2>Record Parameter Value</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Value:
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <button type="submit">Record Value</button>
      </form>
    </div>
  );
}

export default RecordParameterValueForm;
