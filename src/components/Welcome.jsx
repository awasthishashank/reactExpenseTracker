import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import ProfileIncomplete from './ProfileIncomplete';
import CompleteProfile from './CompleteProfile';

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
    </section>
  );
};

export default Welcome;

