import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const CreatePartForm = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [partName, setPartName] = useState('');
  const [selectedCorners, setSelectedCorners] = useState([]);
  const [entryType, setEntryType] = useState('number');
  const [unit, setUnit] = useState('Inches');
  const [customUnit, setCustomUnit] = useState('');
  const [stagedParts, setStagedParts] = useState([]);

  const handleCheckboxChange = (event) => {
    const corner = event.target.value;
    setSelectedCorners((prevCorners) =>
      prevCorners.includes(corner)
        ? prevCorners.filter((c) => c !== corner)
        : [...prevCorners, corner]
    );
  };

  const handleStagePart = (event) => {
    event.preventDefault();

    const partsToStage = selectedCorners.length
      ? selectedCorners.map((corner) => ({
          car_id: carId,
          name: `${corner} ${partName}`,
          corner,
          entry_type: entryType,
          unit: unit === 'Custom' ? customUnit : unit,
        }))
      : [
          {
            car_id: carId,
            name: partName,
            corner: 'Center',
            entry_type: entryType,
            unit: unit === 'Custom' ? customUnit : unit,
          },
        ];

    setStagedParts([...stagedParts, ...partsToStage]);
    setPartName('');
    setSelectedCorners([]);
    setEntryType('number');
    setUnit('Inches');
    setCustomUnit('');
  };

  const handleRemovePart = (index) => {
    setStagedParts(stagedParts.filter((_, i) => i !== index));
  };

  const handleSubmitParts = async () => {
    const { data, error } = await supabase.from('parts').insert(stagedParts);

    if (error) {
      console.error('Error creating parts:', error);
    } else {
      console.log('Parts created:', data);
      navigate(`/`);
    }
  };

  return (
    <div>
      <h2>Create a Part</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <form onSubmit={handleStagePart} style={{ width: '45%' }}>
          <label>
            Part Name:
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Corner:
            <div>
              {['RF', 'RR', 'LF', 'LR', 'Center', 'Engine', 'Rear End', 'Extra (Above)', 'Extra (Below)'].map((corner) => (
                <label key={corner}>
                  <input
                    type="checkbox"
                    value={corner}
                    checked={selectedCorners.includes(corner)}
                    onChange={handleCheckboxChange}
                  />
                  {corner}
                </label>
              ))}
            </div>
          </label>
          <br />
          <label>
            Entry Type:
            <select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
              <option value="number">Number</option>
              <option value="text">Text</option>
            </select>
          </label>
          <br />
          <label>
            Unit:
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              {['Inches', 'Degrees', 'Pounds', 'Clicks', 'Valving', 'Meters', 'Centimeters', 'Millimeters', 'Custom'].map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
          {unit === 'Custom' && (
            <label>
              Custom Unit:
              <input
                type="text"
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                required
              />
            </label>
          )}
          <br />
          <button type="submit">Stage Changes</button>
        </form>
        <div style={{ width: '45%' }}>
          <h3>Staged Parts</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Corner</th>
                <th>Entry Type</th>
                <th>Unit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {stagedParts.map((part, index) => (
                <tr key={index}>
                  <td>{part.name}</td>
                  <td>{part.corner}</td>
                  <td>{part.entry_type}</td>
                  <td>{part.unit}</td>
                  <td>
                    <button onClick={() => handleRemovePart(index)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button onClick={handleSubmitParts}>Submit Parts</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePartForm;
