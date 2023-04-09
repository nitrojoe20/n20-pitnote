import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import GridLayout from "react-grid-layout"
import { Sidebar } from './Sidebar'

export function ScreenHome() {
  return (
    <>
      <Sidebar />
    </>
  );
}