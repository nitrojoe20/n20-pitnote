import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import GridLayout from "react-grid-layout"
import { Sidebar } from './Sidebar'
import { CurrentContent } from './CurrentContent'

export function ScreenHome() {
  const [currentContent, setCurrentContent] = useState('dashboard');
  const handleSidebarButtonClick = (buttonId) => {
    setCurrentContent(buttonId);
  };
  return (
    <>
      <Sidebar onButtonClick={handleSidebarButtonClick}/>
      <CurrentContent contentId={currentContent} />
    </>
  );
}