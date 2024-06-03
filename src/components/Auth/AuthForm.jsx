import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authActions } from '../../store/authSlice';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setIsForgotPassword(false);
  };

  const forgotPasswordHandler = () => {
    setIsForgotPassword(true);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    if (isForgotPassword) {
      setIsLoading(true);
      try {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M', {
          method: 'POST',
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: enteredEmail,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Password reset failed!');
        }

        alert('Password reset email sent!');
        setIsForgotPassword(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const enteredPassword = passwordInputRef.current?.value;
    if (!isLogin) {
      const enteredConfirmPassword = confirmPasswordInputRef.current?.value;
      if (enteredPassword !== enteredConfirmPassword) {
        setError("Passwords do not match!");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    let url;
    if (isLogin) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Authentication Failed";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch(authActions.login(data.idToken));
      history.replace('/welcome');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        {!isForgotPassword && (
          <>
            <div className={classes.control}>
              <label htmlFor="password">Your Password</label>
              <input type="password" id="password" required ref={passwordInputRef} />
            </div>
            {!isLogin && (
              <div className={classes.control}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" required ref={confirmPasswordInputRef} />
              </div>
            )}
          </>
        )}
        <div className={classes.actions}>
          <button type="submit">
            {isForgotPassword ? "Send Reset Email" : isLogin ? "Login" : "Create Account"}
          </button>
          {isLoading && <p>Loading...</p>}
          {error && <p className={classes.error}>{error}</p>}
          {!isForgotPassword && (
            <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          )}
          {isLogin && !isForgotPassword && (
            <button type="button" className={classes.forgot} onClick={forgotPasswordHandler}>
              Forgot Password?
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
