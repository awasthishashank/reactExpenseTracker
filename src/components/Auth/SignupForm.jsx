import { useState, useRef } from "react";
import classes from "./SignupForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    if (enteredPassword !== enteredConfirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M", {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log("User has successfully signed up.");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" required ref={confirmPasswordInputRef} />
        </div>
        <div className={classes.actions}>
          <button type="submit">Create Account</button>
          {isLoading && <p>Loading...</p>}
          {error && <p className={classes.error}>{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
