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
  original?: boolean;
}

export function UsernameLink({
  username,
  current,
  blockContainer,
  noBy,
  original,
}: usernameLinkProps) {
  return blockContainer ? (
    <span className={original ? "username-orig" : "username"}>
      {!noBy && "by "}
      <Link
        to={`/${createLookupName(username)}`}
        className={original ? "reverse" : ""}
      >
        {current ? "you" : username}
      </Link>
    </span>
  ) : (
    <div className={original ? "username-orig" : "username"}>
      {!noBy && "by "}
      <Link
        to={`/${createLookupName(username)}`}
        className={original ? "reverse" : ""}
      >
        {current ? "you" : username}
      </Link>
    </div>
  );
}
