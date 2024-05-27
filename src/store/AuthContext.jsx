import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isEmailVerified: false,
  userProfile: null,
  userId: '',
  login: (token) => {},
  logout: () => {},
  setUserProfile: (profile) => {},
  setUserId: (id) => {}, 
  setVerificationStatus: (isVerified) => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [userProfile, setUserProfile] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userId, setUserId] = useState('');

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserProfile(null);
    setIsEmailVerified(false);
    setUserId('');
    localStorage.removeItem('token');
  };

  const setUserProfileHandler = (profile) => {
    setUserProfile(profile);
    setUserId(profile.localId); // Set the userId from the profile
  };

  const setVerificationStatusHandler = (isVerified) => {
    setIsEmailVerified(isVerified);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    isEmailVerified: isEmailVerified,
    userProfile: userProfile,
    userId: userId,
    login: loginHandler,
    logout: logoutHandler,
    setUserProfile: setUserProfileHandler,
    setUserId: setUserId, // Updated this line
    setVerificationStatus: setVerificationStatusHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
