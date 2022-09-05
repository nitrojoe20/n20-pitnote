import { useState } from 'react'
import { supabase } from './supabaseClient'
import {SignUp} from './AuthSignUp'
import Modal from 'react-modal';
 
export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [IsShown, setIsShown] = useState(false)
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background:'black'
    },
  };

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

  const toggleModal=event=> {
    event.preventDefault()
    setIsShown(current=>!current)
  }

  return (
    <div className="signInBox">
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
        <hr></hr>
        <form onSubmit={toggleModal}>
          <button className="button primary block" aria-live="polite">
                Sign Up
          </button>
          <Modal
          isOpen={IsShown}
          onRequestClose={toggleModal}
          style={customModalStyles}>
          <button onClick={toggleModal}>X</button>
          {IsShown&&<SignUp/>}
          </Modal>
        </form>
      </div>
  )
}