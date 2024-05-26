import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import ProfileIncomplete from './ProfileIncomplete';
import CompleteProfile from './CompleteProfile';

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const sendVerificationEmail = async () => {
    setVerificationSent(false);
    setVerificationError(null);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`,
        {
          method: 'POST',
          body: JSON.stringify({
            requestType: 'VERIFY_EMAIL',
            idToken: authCtx.token,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = 'Failed to send verification email.';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Verification email sent successfully', data);
      setVerificationSent(true);
    } catch (err) {
      setVerificationError(err.message);
    }
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authCtx.token) return;

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`,
          {
            method: 'POST',
            body: JSON.stringify({ idToken: authCtx.token }),
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const data = await response.json();
        const userProfile = data.users[0];
        authCtx.setUserProfile(userProfile);
        setIsProfileComplete(!!userProfile.displayName && !!userProfile.photoUrl);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [authCtx.token, authCtx]);

  return (
    <section>
      <h1>Welcome to Expense Tracker</h1>
      {!isProfileComplete ? <ProfileIncomplete /> : <p>Profile is complete!</p>}
      {!authCtx.isEmailVerified && (
        <>
          {!verificationSent && <button onClick={sendVerificationEmail}>Verify Email</button>}
          {verificationSent && <p>Verification email sent successfully. Please check your inbox.</p>}
          {verificationError && <p>{verificationError}</p>}
        </>
      )}
      {authCtx.isEmailVerified && <p>Your email is verified.</p>}
    </section>
  );
};

export default Welcome;

