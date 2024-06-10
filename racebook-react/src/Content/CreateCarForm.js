import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

function CreateCarForm() {
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carSerial, setCarSerial] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = supabase.auth.user();

    if (user) {
      const carData = {
        user_id: user.id,
        name: carName,
        year: parseInt(carYear, 10),
        make: carModel,
        serial: carSerial,
      };

      // Log the data to be sent
      console.log('Car Data:', carData);
      console.log('Auth Token:', supabase.auth.session()?.access_token);

      try {
        const { data, error } = await supabase
          .from('cars')
          .insert([carData]);

        if (error) {
          throw error;
        }

        console.log('Car created:', data);
        navigate('/'); // Navigate back to the dashboard
      } catch (error) {
        console.error('Error creating car:', error.message);
        console.error('Error details:', error);
      }
    } else {
      console.error('User not logged in');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Create a Car</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Car Name:
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Make:
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />
        </label>
        <br />
        <label>
          Year:
          <input
            type="number"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
          />
        </label>
        <br />
        <label>
          Serial:
          <input
            type="text"
            value={carSerial}
            onChange={(e) => setCarSerial(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Car</button>
      </form>
      <button onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
}

export default CreateCarForm;
