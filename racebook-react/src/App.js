import './index.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScreenAuth from './ScreenAuth';
import ScreenHome from './ScreenHome';
import CreateCarForm from './Content/CreateCarForm'; // Import your form component

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
            <Route path="/create-car" element={<CreateCarForm />} />
            <Route path="/" element={<ScreenHome key={session.user.id} session={session} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}
