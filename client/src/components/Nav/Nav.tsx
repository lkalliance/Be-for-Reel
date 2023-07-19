// This component renders the navigation

import "./Nav.css";
import auth from "../../utils/auth";
import { Link } from "react-router-dom";

type userData = {
  username: string;
  id: string;
};

export function Nav() {
  const userInfo: userData = auth.getProfile();

  return (
    <nav>
      <ul>
        {auth.loggedIn() ? (
          <>
            <li>
              <Link
                to={`/user/${userInfo.username}`}
              >{`${userInfo.username}`}</Link>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  auth.logout();
                }}
              >
                Log out
              </a>
            </li>
            <li>
              <Link to="/create">Create a Poll</Link>
            </li>
          </>
        ) : (
          <li>
            <a href="/login">Log in or sign up</a>
          </li>
        )}
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/polls">Polls</Link>
        </li>
      </ul>
    </nav>
  );
}
