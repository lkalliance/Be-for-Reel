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
import { toggleNav } from "../../utils";
import { AuthService } from "../../utils/auth";

interface userMenuProps {
  uname?: string;
  lookup?: string;
  setMenu: Dispatch<SetStateAction<boolean>>;
  setLogIn: Dispatch<SetStateAction<boolean>>;
  setShowSearch?: Dispatch<SetStateAction<boolean>>;
  showUserName?: boolean;
  hideSearch: () => void;
}

export function UserMenu({
  lookup,
  setMenu,
  setLogIn,
  setShowSearch,
  hideSearch,
}: userMenuProps) {
  const auth = new AuthService();
  return (
    <div id="user-menu">
      <ul>
        <li className="user-link">
          <Link
            to={`/${lookup}`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setMenu(false);
              toggleNav();
              hideSearch();
            }}
          >
            Profile
          </Link>
        </li>

        <li className="create-link">
          <Link
            to={`/create`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setMenu(false);
              toggleNav();
              hideSearch();
            }}
          >
            Create a poll
          </Link>
        </li>

        <li>
          <Link
            to="/"
            onClick={(e) => {
              if (setShowSearch) setShowSearch(false);
              e.preventDefault();
              auth.logout();
              setLogIn(false);
              setMenu(false);
              toggleNav();
              hideSearch();
            }}
          >
            Log out
          </Link>
        </li>
      </ul>
    </div>
  );
}
