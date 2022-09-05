import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'



export function ScreenHome() {

    const handleSignOut=async(e)=>{
      await supabase.auth.signOut()
    }


return(

    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
            <h1 className="header">RaceBook Home</h1>
            <p className="description">Home</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    </div>

)
}