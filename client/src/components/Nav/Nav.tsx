// This component renders the navigation

import "./Nav.css";
import auth from "../../utils/auth";
import { NavLink } from "react-router-dom";

interface navProps {
  uname: string;
}

export function Nav({ uname }: navProps) {
  return (
    <nav>
      <ul>
        {auth.loggedIn() ? (
          <>
            <li>
              <NavLink to={`/${uname}`}>{`${uname}`}</NavLink>
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
              <NavLink to="/create">Create a Poll</NavLink>
            </li>
          </>
        ) : (
          <li>
            <a href="/login">Log in or sign up</a>
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
