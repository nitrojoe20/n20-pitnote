import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScreenAuth from './ScreenAuth';
import ScreenHome from './ScreenHome';
import CreateCarForm from './Content/CreateCarForm'; // Import your form component
import CreatePartForm from './Content/CreatePartForm';
import CreateParameterForm from './Content/CreateParameterForm';
import RecordParameterValueForm from './Content/RecordParameterValueForm';
import ViewParameters from './Content/ViewParameters';
import RecordPartValuesForm from './Content/RecordPartValuesForm'; // Import the new form

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <div className="">
        {!session ? (
          <ScreenAuth />
        ) : (
          <Routes>
            <Route path="/create-part/:carId" element={<CreatePartForm />} />
            <Route path="/create-parameter" element={<CreateParameterForm />} />
            <Route path="/record-parameter-value" element={<RecordParameterValueForm />} />
            <Route path="/view-parameters/:partId" element={<ViewParameters />} />
            <Route path="/create-car" element={<CreateCarForm />} />
            <Route path="/record-part-values/:carId" element={<RecordPartValuesForm />} /> {/* Add this line */}
            <Route path="/" element={<ScreenHome session={session} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}
