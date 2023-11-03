// This component renders the navigation

import "./Nav.css";
import { AuthService } from "../../utils/auth";
import { NavLink } from "react-router-dom";

interface navProps {
  uname: string;
  lookup: string;
}

export function Nav({ uname, lookup }: navProps) {
  const Auth = new AuthService();
  return (
    <nav>
      <ul>
        {Auth.loggedIn() ? (
          <>
            <li>
              <NavLink to={`/${lookup}`}>{`${uname}`}</NavLink>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  Auth.logout();
                }}
              >
                Log out
              </a>
            </li>
            <li>
              <NavLink to="/create">Create a Poll</NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login">Log in or sign up</NavLink>
          </li>
        )}
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/polls">Polls</NavLink>
        </li>
      </ul>
    </nav>
  );
}
