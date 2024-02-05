// This component renders a username with a link to their profile

/* REQUIRED PROPS
username: string of the user's username */

import "./UsernameLink.css";
import { Link } from "react-router-dom";
import { createLookupName } from "../../utils";

interface usernameLinkProps {
  username: string;
  current?: boolean;
}

export function UsernameLink({ username, current }: usernameLinkProps) {
  return (
    <div className="username">
      by{" "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </div>
  );
}
