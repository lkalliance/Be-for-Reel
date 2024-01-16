// This component renders a username with a link to their profile

/* REQUIRED PROPS
username: string of the user's username */

import "./UsernameLink.css";
import { Link } from "react-router-dom";
import { createLookupName } from "../../utils";

interface usernameLinkProps {
  username: string;
}

export function UsernameLink({ username }: usernameLinkProps) {
  return (
    <Link to={`/${createLookupName(username)}`} className="reverse">
      {username}
    </Link>
  );
}
