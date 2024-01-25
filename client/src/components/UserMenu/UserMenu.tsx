import "./UserMenu.css";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../utils/auth";

interface userMenuProps {
  uname: string;
  lookup: string;
  menu: boolean;
  setMenu: Dispatch<SetStateAction<boolean>>;
}

export function UserMenu({ uname, lookup, menu, setMenu }: userMenuProps) {
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
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setMenu(false);
              Auth.logout();
            }}
          >
            Log out
          </Link>
        </li>
      </ul>
    </div>
  );
}
