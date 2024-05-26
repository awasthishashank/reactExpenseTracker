import { useHistory } from 'react-router-dom';
import classes from './ProfileIncomplete.module.css';

const ProfileIncomplete = () => {
  const history = useHistory();

  const completeProfileHandler = () => {
    history.push('/complete-profile');
  };

  return (
    <section className={classes.profileIncomplete}>
      <h2>Your profile is incomplete!</h2>
      <button onClick={completeProfileHandler}>Complete Profile</button>
    </section>
  );
};

export default ProfileIncomplete;
