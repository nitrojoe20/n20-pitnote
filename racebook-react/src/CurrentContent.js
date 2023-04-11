import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './Content/Dashboard';
import Profile from './Content/Profile';
import Settings from './Content/Settings';

export function CurrentContent(props) {
  let content;
  switch (props.contentId) {
    case 'dashboard':
      content = <Dashboard/>;
      break;
    case 'settings':
      content = <Settings/>;
      break;
    case 'profile':
      content = <Profile/>;
      break;
    default:
      content = null;
  }

  return (
    <div className="homecontent">
      {content}
    </div>
  );
}
