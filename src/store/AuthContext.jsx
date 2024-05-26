import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isEmailVerified: false,
  userProfile: null,
  login: (token) => {},
  logout: () => {},
  setUserProfile: (profile) => {},
  setVerificationStatus: (isVerified) => {}
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [userProfile, setUserProfile] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserProfile(null);
    setIsEmailVerified(false);
    localStorage.removeItem('token');
  };

  const setUserProfileHandler = (profile) => {
    setUserProfile(profile);
  };

  const setVerificationStatusHandler = (isVerified) => {
    setIsEmailVerified(isVerified);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    isEmailVerified: isEmailVerified,
    userProfile: userProfile,
    login: loginHandler,
    logout: logoutHandler,
    setUserProfile: setUserProfileHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
