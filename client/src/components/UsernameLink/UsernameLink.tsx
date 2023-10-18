// This components renders a single poll listing on a list of polls

import "./UsernameLink.css";
import { createLookupName } from "../../utils/typeUtils";
import { Link } from "react-router-dom";

interface usernameLinkProps {
  username: string;
}

export function UsernameLink({ username }: usernameLinkProps) {
  console.log(`The UsernameLink component thinks the user is ${username}`);

  return <Link to={`/${createLookupName(username)}`}>{username}</Link>;
}
