// This component renders the user menu when it is visible

/* REQUIRED PROPS:
uname: string of the user's username
lookup: string of the user's lookup name
setMenu: handler to alter the flag to show/hide the menu
setLogIn: handler to alter the flag that a user is/isn't logged in
setShowSearch: handler to alter the flat to show/hide search bar */

import "./UserMenu.css";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";

interface userMenuProps {
  uname: string;
  lookup: string;
  setMenu: Dispatch<SetStateAction<boolean>>;
  setLogIn: Dispatch<SetStateAction<boolean>>;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
}

export function UserMenu({
  uname,
  lookup,
  setMenu,
  setLogIn,
  setShowSearch,
}: userMenuProps) {
  const Auth = new AuthService();
  return (
    <div id="user-menu">
      <ul>
        <li>
          <Link
            to={`/${lookup}`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setMenu(false);
            }}
          >
            {uname}
          </Link>
        </li>
        <li>
          <Link
            to="/"
            onClick={(e) => {
              setShowSearch(false);
              e.preventDefault();
              Auth.logout();
              setLogIn(false);
            }}
          >
            Log out
          </Link>
        </li>
      </ul>
    </div>
  );
}
