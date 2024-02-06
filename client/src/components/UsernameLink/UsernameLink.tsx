// This component renders a username with a link to their profile

/* REQUIRED PROPS
username: string of the user's username */

import "./UsernameLink.css";
import { Link } from "react-router-dom";
import { createLookupName } from "../../utils";

interface usernameLinkProps {
  username: string;
  current?: boolean;
  noBy?: boolean;
  blockContainer?: boolean;
}

export function UsernameLink({
  username,
  current,
  blockContainer,
  noBy,
}: usernameLinkProps) {
  return blockContainer ? (
    <span className="username">
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </span>
  ) : (
    <div className="username">
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </div>
  );
}
