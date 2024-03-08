// This component renders the page header

import "./Header.css";
import { useState, useRef, Dispatch, SetStateAction } from "react";
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

  const navRef = useRef<{ closeSearch: () => void }>();

  // THIS IS FOR USING AN A/B SWITCH
  // const handleSwitch = (e: React.MouseEvent<HTMLSpanElement>) => {
  //   e.preventDefault();
  //   const { id } = e.currentTarget;
  //   abSwitch(id);
  // };

  return (
    <header>
      {/* 
        THIS IS FOR USING AN A/B SWITCH
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
      </div> */}
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
        <a
          href="@"
          className="reverse click-to-open"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
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
        </a>
        {loggedIn && showUserMenu && (
          <UserMenu
            hideSearch={
              navRef.current
                ? navRef.current.closeSearch
                : () => {
                    console.log("no reference");
                  }
            }
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
        ref={navRef}
        loggedIn={loggedIn}
        setLogIn={setLogIn}
        setShowUserMenu={setShowUserMenu}
        currentSwitch={currentSwitch}
      />
    </header>
  );
}
