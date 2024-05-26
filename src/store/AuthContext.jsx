import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userProfile: null,
  login: (token) => {},
  logout: () => {},
  setUserProfile: (profile) => {}
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [userProfile, setUserProfile] = useState(null);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserProfile(null);
    localStorage.removeItem('token');
  };

  const setUserProfileHandler = (profile) => {
    setUserProfile(profile);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
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
