import { useState } from "react";
import { supabase } from './supabaseClient'
export function Sidebar(props) {
  const handleSignOut = async (e) => {
    await supabase.auth.signOut();
  };
  const handleButtonClick = (buttonId) => {
    props.onButtonClick(buttonId);
  };
  return (
    <div className="sidebar">
      <button onClick={() => handleButtonClick('dashboard')}>Dashboard</button>
      <button onClick={() => handleButtonClick('settings')}>Settings</button>
      <button onClick={() => handleButtonClick('profile')}>Profile</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <p>Logged in as:<br></br>{supabase.auth.user().email}</p>
    </div>
  );
}