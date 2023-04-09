import { useState } from 'react'
import { supabase } from './supabaseClient'
import PasswordChecklist from 'react-password-checklist';
 

// class Form extends Component{
//   constructor (signUpProps){
//     super(signUpProps);
//     this.state = {
//       email:'',
//       password:'',
//       formErrors: {email:'', password:''},
//       emailValid: false,
//       passwordValid: false,
//       formValid:false
//     }
//   }
//     handleUserInput = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     this.setState({[name]: value},
//                   () => { this.validateField(name, value) });
//   }

//   validateField(fieldName, value) {
//     let fieldValidationErrors = this.state.formErrors;
//     let emailValid = this.state.emailValid;
//     let passwordValid = this.state.passwordValid;

//     switch(fieldName) {
//       case 'email':
//         emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
//         fieldValidationErrors.email = emailValid ? '' : ' is invalid';
//         break;
//       case 'password':
//         passwordValid = value.length >= 6;
//         fieldValidationErrors.password = passwordValid ? '': ' is too short';
//         break;
//       default:
//         break;
//     }
//     this.setState({formErrors: fieldValidationErrors,
//                     emailValid: emailValid,
//                     passwordValid: passwordValid
//                   }, this.validateForm);
//   }

//   validateForm() {
//     this.setState({formValid: this.state.emailValid && this.state.passwordValid});
//   }

//   errorClass(error) {
//     return(error.length === 0 ? '' : 'has-error');
//   }
// }


export function SignUp() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)
  const [validButtonStyle, setValidButtonStyle] = useState("button block");

  const handleSignUp = async (e) => {
    e.preventDefault()
    //validation
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

  const handlePasswordValidLoad=async (e)=> {
    setValidButtonStyle("button block")
  }

  const handlePasswordValid=async (e)=> {
    await setPasswordValid(current=>!current)
    if(!passwordValid){
      setValidButtonStyle("button primary block")
    }
    else{
      setValidButtonStyle("button block")
    }
  }

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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordChecklist
              rules={["minLength","specialChar","number","capital","match"]}
              minLength={6}
              value={password}
              valueAgain={confirmPassword}
              onChange={(isValid) => handlePasswordValid()}
            />
            <button className={validButtonStyle} aria-live="polite" disabled={!passwordValid}>
              Sign Up
            </button>
          </form>
        )}
      </div>
  )
}