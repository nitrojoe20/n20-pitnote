import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import GridLayout from "react-grid-layout"
import { Sidebar } from './Sidebar'
import { CurrentContent } from './CurrentContent'

const handleSidebarButtonClick = (buttonId) => {
  setCurrentContent(buttonId);
};

export function ScreenHome() {
  return (
    <>
      <Sidebar />
      <CurrentContent />
    </>
  );
}