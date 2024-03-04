// This component renders the page header

import "./Header.css";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";
import { HeaderNav } from "../../pageComponents";
import { UsernameLink } from "../../components";

interface headerProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
  abSwitch: Dispatch<SetStateAction<string>>;
  currentSwitch: string;
}

export function Header({
  loggedIn,
  setLogIn,
  abSwitch,
  currentSwitch,
}: headerProps) {
  const auth = new AuthService();
  const { userName } = auth.getProfile();

  const handleSwitch = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    abSwitch(id);
  };
  return (
    <header>
      <div id="switch">
        <span
          onClick={handleSwitch}
          id="a"
          className={currentSwitch === "a" ? "selected" : ""}
        >
          A
        </span>
        <span
          onClick={handleSwitch}
          id="b"
          className={currentSwitch === "b" ? "selected" : ""}
        >
          B
        </span>
      </div>
      <UsernameLink username={userName} noBy={true} />
      {!auth.loggedIn() && (
        <Link className="header-login-link" to="/login">
          Log in or sign up
        </Link>
      )}

      <HeaderNav loggedIn={loggedIn} setLogIn={setLogIn} />
    </header>
  );
}
