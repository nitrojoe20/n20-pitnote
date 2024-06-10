import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import CreatePartForm from './CreatePartForm';
import CreateParameterForm from './CreateParameterForm';
import RecordParameterValueForm from './RecordParameterValueForm';

function PartsList({ carId }) {
  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    fetchParts();
  }, []);

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

  const fetchParameters = async (partId) => {
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

  const handlePartClick = (partId) => {
    setSelectedPartId(partId);
    fetchParameters(partId);
  };

  return (
    <div>
      <CreatePartForm carId={carId} onPartCreated={fetchParts} />
      <h2>Parts List</h2>
      <ul>
        {parts.map((part) => (
          <li key={part.id} onClick={() => handlePartClick(part.id)}>
            {part.name}
          </li>
        ))}
      </ul>

      {selectedPartId && (
        <div>
          <CreateParameterForm partId={selectedPartId} onParameterCreated={() => fetchParameters(selectedPartId)} />
          <h2>Parameters for Selected Part</h2>
          <ul>
            {parameters.map((parameter) => (
              <li key={parameter.id}>
                {parameter.name} ({parameter.unit}) - Type: {parameter.type}
                <RecordParameterValueForm partParameterId={parameter.id} onValueRecorded={() => fetchParameters(selectedPartId)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PartsList;
