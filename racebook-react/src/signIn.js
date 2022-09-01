import { useState } from 'react'
import { supabase } from './supabaseClient'
import PasswordChecklist from 'react-password-checklist';
 
export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in with your email below</p>
        {loading ? (
          'Loading...'
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  )
}