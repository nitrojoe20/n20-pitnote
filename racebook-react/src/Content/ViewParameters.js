import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Ensure this path is correct
import { session } from '../App.js';
 
function ViewParameters() {
  const { partId } = useParams();
  const navigate = useNavigate();
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    const { data, error } = await supabase
      .from('part_parameters')
      .select('*')
      .eq('part_id', partId);

    if (error) {
      console.error('Error fetching parameters:', error);
    } else {
      setParameters(data);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Parameters for Part</h2>
      <ul>
        {parameters.map((parameter) => (
          <li key={parameter.id}>
            {parameter.name} ({parameter.unit}) - Type: {parameter.type}
          </li>
        ))}
      </ul>
      <button onClick={handleBackClick}>Back to Dashboard</button>
    </div>
  );
}

export default ViewParameters;
