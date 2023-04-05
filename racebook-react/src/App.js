import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { ScreenAuth } from './ScreenAuth'
import { ScreenHome } from './ScreenHome'

import Account from './Account'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <ScreenAuth /> : <ScreenHome key={session.user.id} session={session} />}
    </div>
  )
}