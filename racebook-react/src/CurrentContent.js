import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard';

export function CurrentContent(props) {
  let content;
  switch (props.contentId) {
    case 'dashboard':
      content = <Dashboard/>;
      break;
    case 'settings':
      content = "";
      break;
    case 'profile':
      content = "";
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
