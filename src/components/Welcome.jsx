import React, { useContext } from 'react';
import AuthContext from '../store/AuthContext';
import ProfileIncomplete from './ProfileIncomplete';

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  
  // Assume that profile completion is checked via a context or state
  const isProfileComplete = false; // Replace with actual check

  return (
    <section>
      <h1>Welcome to Expense Tracker</h1>
      {!isProfileComplete && <ProfileIncomplete />}
    </section>
  );
};

export default Welcome;
