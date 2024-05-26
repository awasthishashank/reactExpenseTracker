import React from 'react';
import { useHistory } from 'react-router-dom';
import classes from './ProfileIncomplete.module.css';

const ProfileIncomplete = () => {
  const history = useHistory();

  const completeProfileHandler = () => {
    history.push('/complete-profile');
  };

  return (
    <div className={classes.incomplete}>
      <p>Your profile is incomplete.</p>
      <button onClick={completeProfileHandler}>Complete Profile</button>
    </div>
  );
};

export default ProfileIncomplete;
