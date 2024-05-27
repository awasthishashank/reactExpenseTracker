import React, { useContext } from "react";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

const Header = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/");
  };

  return (
    <div className="Header">
      <ul className="header-list">
        <li>
          <Link to="/store">Store</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact-Us</Link>
        </li>
        {!isLoggedIn && (
          <li>
            <Link to="/">Login</Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button className="logout" onClick={logoutHandler}>Logout</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
