import "./Nav.css";
import auth from "../../utils/auth";

export function Nav() {
  return (
    <nav>
      <ul>
        {auth.loggedIn() ? (
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
