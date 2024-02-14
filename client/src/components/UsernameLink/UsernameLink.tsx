// This component renders a username with a link to their profile

/* REQUIRED PROPS
username: string of the user's username */

/* OPTIONAL PROPS
current: boolean flag, is this the current user?
noBy: boolean flag, hide the "by" word
blockContainer: boolean flag, should this be a span instead of a div
original: boolean flag, should this be rendered in component's original style */

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
    <span
      className={`${current ? "you-data as-div " : "user-data as-div "}${
        original ? "username-orig" : "username"
      }`}
    >
      {!noBy && "by "}
      <Link
        to={`/${createLookupName(username)}`}
        className={original ? "reverse" : ""}
      >
        {current ? "you" : username}
      </Link>
    </span>
  ) : (
    <div
      className={`${current ? "you-data " : "user-data "}${
        original ? "username-orig" : "username"
      }`}
    >
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
