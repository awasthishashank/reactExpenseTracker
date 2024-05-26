import { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '../store/AuthContext';
import classes from './CompleteProfile.module.css';

const CompleteProfile = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const displayNameInputRef = useRef();
  const photoUrlInputRef = useRef();

  useEffect(() => {
    console.log('Current token:', authCtx.token); // Log the token to check if it's correct
    if (authCtx.userProfile) {
      displayNameInputRef.current.value = authCtx.userProfile.displayName || '';
      photoUrlInputRef.current.value = authCtx.userProfile.photoUrl || '';
    }
  }, [authCtx.userProfile, authCtx.token]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredDisplayName = displayNameInputRef.current.value;
    const enteredPhotoUrl = photoUrlInputRef.current.value;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`,
        {
          method: 'POST',
          body: JSON.stringify({
            idToken: authCtx.token,
            displayName: enteredDisplayName,
            photoUrl: enteredPhotoUrl,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      const data = await response.json();
      authCtx.setUserProfile({
        displayName: data.displayName,
        photoUrl: data.photoUrl,
      });

      console.log('Profile updated successfully', data);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <section className={classes.profile}>
      <h1>Complete Your Profile</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="displayName">Your Name</label>
          <input type="text" id="displayName" required ref={displayNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="photoUrl">Profile Photo URL</label>
          <input type="url" id="photoUrl" required ref={photoUrlInputRef} />
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
