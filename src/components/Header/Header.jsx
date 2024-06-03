import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import "./Header.css";

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const logoutHandler = () => {
    dispatch(authActions.logout());
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
