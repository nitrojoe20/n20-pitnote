import { useState } from 'react'
import { supabase } from './supabaseClient'
import PasswordChecklist from 'react-password-checklist';
import { useEffect } from 'react';
import { validate } from 'react-email-validator';

export function SignUp() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [validButtonStyle, setValidButtonStyle] = useState("button")

  const handleSignUp = async (e) => {
    e.preventDefault()
    // validation
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailValidation = (e) => {
    setEmail(e.target.value)
    setEmailValid(validateEmail(e.target.value))
  }

  const validateEmail = (email) => {
    return validate(email)
  }

  const handlePasswordValid = (isValid) => {
    setPasswordValid(isValid)
  }

  useEffect(() => {
    if (emailValid && passwordValid) {
      setValidButtonStyle("button block primary")
    } else {
      setValidButtonStyle("button block")
    }
  }, [emailValid, passwordValid])

  return (
    <div className="signInBox">
      <h1 className="header">Sign Up</h1>
      <p className="description">Sign up with your email below</p>

      {loading ? (
        'Submitting User...'
      ) : (
        <form onSubmit={handleSignUp}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className={`inputField ${emailValid ? '' : 'invalid'}`}
            type="email"
            placeholder="Your email"
            value={email}
            onChange={handleEmailValidation}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            className={`inputField ${passwordValid ? '' : 'invalid'}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="password"
            className={`inputField ${passwordValid ? '' : 'invalid'}`}
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <br></br> <br></br>
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={6}
            value={password}
            valueAgain={confirmPassword}
            onChange={handlePasswordValid}
          />
          <br></br>
          <button
            className={validButtonStyle}
            aria-live="polite"
            disabled={!emailValid || !passwordValid}
          >
            Sign Up
          </button>
          {!emailValid && email.length > 0 && (
            <p className="error">Invalid email format</p>
          )}
        </form>
      )}
    </div>
  )
}
