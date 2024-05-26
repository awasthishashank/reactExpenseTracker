import { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../store/AuthContext';
import classes from './CompleteProfile.module.css';

const CompleteProfile = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const fullNameInputRef = useRef();
  const photoUrlInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredFullName = fullNameInputRef.current.value;
    const enteredPhotoUrl = photoUrlInputRef.current.value;

    setIsLoading(true);
    setError(null);

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        displayName: enteredFullName,
        photoUrl: enteredPhotoUrl,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Profile update failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log("Profile updated successfully!");
        history.replace('/welcome');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <section className={classes.completeProfile}>
      <h1>Complete Your Profile</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" required ref={fullNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="photoUrl">Photo URL</label>
          <input type="text" id="photoUrl" required ref={photoUrlInputRef} />
        </div>
        <div className={classes.actions}>
          <button type="submit">Update Profile</button>
          {isLoading && <p>Loading...</p>}
          {error && <p className={classes.error}>{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default CompleteProfile;
