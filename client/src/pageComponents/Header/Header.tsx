// This component renders the page header

import "./Header.css";
import { useState, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../utils/auth";
import { toggleNav } from "../../utils";
import { HeaderNav } from "../../pageComponents";
import { UserMenu } from "../../components";

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
  const { userName, lookupName } = auth.getProfile();

  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

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
      <div
        className="username original"
        onMouseOver={() => {
          setShowUserMenu(true);
        }}
        onMouseOut={() => {
          setShowUserMenu(false);
        }}
      >
        <Link
          to={`/${lookupName}`}
          className="reverse click-to-navigate"
          onClick={toggleNav}
        >
          {userName}
          {loggedIn && (
            <FontAwesomeIcon
              icon={faCaretRight}
              className="caret-right reverse"
            />
          )}
        </Link>
        <div
          className="reverse click-to-open"
          onClick={() => {
            toggleNav();
            setShowUserMenu(!showUserMenu);
          }}
        >
          {userName}
          {loggedIn && (
            <FontAwesomeIcon
              icon={faCaretRight}
              className="caret-right reverse"
            />
          )}
        </div>
        {loggedIn && showUserMenu && (
          <UserMenu
            setMenu={setShowUserMenu}
            setLogIn={setLogIn}
            lookup={lookupName}
          />
        )}
      </div>
      {!auth.loggedIn() && (
        <Link className="header-login-link" to="/login" onClick={toggleNav}>
          Log in or sign up
        </Link>
      )}

      <HeaderNav
        loggedIn={loggedIn}
        setLogIn={setLogIn}
        currentSwitch={currentSwitch}
      />
    </header>
  );
}
