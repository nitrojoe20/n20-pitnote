import SignIn from './AuthSignIn'
import { SignUp } from './AuthSignUp'


export function ScreenAuth() {

return(

    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
            <h1 className="header">pitNote</h1>
            <p className="description">Sign in with your email below</p>
            <SignIn/>
        </div>
    </div>

)
}