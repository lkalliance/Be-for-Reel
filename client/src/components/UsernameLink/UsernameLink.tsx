// This components renders a single poll listing on a list of polls

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
