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
  type?: string;
}

export function UsernameLink({
  username,
  current,
  type,
  noBy,
}: usernameLinkProps) {
  return type === "div" ? (
    <div
      className={`${current ? "username you-data " : "username user-data "}`}
    >
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </div>
  ) : type === "span-tag" ? (
    <span
      className={`${
        current ? "username tag you-data " : "username tag user-data "
      }`}
    >
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </span>
  ) : type === "span" ? (
    <span
      className={`${current ? "username you-data " : "username user-data "}`}
    >
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`}>
        {current ? "you" : username}
      </Link>
    </span>
  ) : (
    <div className="username original">
      {!noBy && "by "}
      <Link to={`/${createLookupName(username)}`} className="reverse">
        {current ? "you" : username}
      </Link>
    </div>
  );
}
