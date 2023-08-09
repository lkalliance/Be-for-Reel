// This component renders the navigation

import "./Nav.css";
import auth from "../../utils/auth";
import { Link } from "react-router-dom";
import { userData } from "../../utils/interfaces";

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
              <Link to={`/${uname}`}>{`${uname}`}</Link>
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
