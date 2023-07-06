import "./Nav.css";
import { useState } from "react";
import auth from "../../utils/auth";

export function Nav() {
  const [username, setUsername] = useState(auth.getUsername);

  return (
    <nav>
      <ul>
        {auth.loggedIn() ? (
          <li>
            <a href="/">{username}</a>
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
        ) : (
          <li>
            <a href="/login">Log in or sign up</a>
          </li>
        )}
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/polls">Polls</a>
        </li>
      </ul>
    </nav>
  );
}
