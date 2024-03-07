// This component renders the page header

import "./Header.css";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../utils/auth";
import { HeaderNav } from "../../pageComponents";
import { UserMenu, RefNav } from "../../components";

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
  const navRef = useRef<() => void>();

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
          onClick={() => {
            if (navRef.current) navRef.current();
          }}
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
            if (navRef.current) navRef.current();
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
            toggleNav={navRef.current}
          />
        )}
      </div>
      {!auth.loggedIn() && (
        <Link
          className="header-login-link"
          to="/login"
          onClick={() => {
            if (navRef.current) {
              navRef.current();
            }
          }}
        >
          Log in or sign up
        </Link>
      )}

      <RefNav
        ref={navRef}
        loggedIn={loggedIn}
        setLogIn={setLogIn}
        currentSwitch={currentSwitch}
      />
    </header>
  );
}
