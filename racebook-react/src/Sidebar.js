import { useState } from "react";
import { supabase } from './supabaseClient'
export function Sidebar() {
  const handleSignOut = async (e) => {
    await supabase.auth.signOut();
  };
  return (
    <div className="sidebar">
      <button>New Race</button>
      <button>New Car</button>
      <button>Settings</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <p>Logged in as:<br></br>{supabase.auth.user().email}</p>
    </div>
  );
}