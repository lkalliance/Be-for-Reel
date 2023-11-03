// This components renders a single poll listing on a list of polls

import "./UsernameLink.css";
import { createLookupName } from "../../utils";
import { Link } from "react-router-dom";

interface usernameLinkProps {
  username: string;
}

export function UsernameLink({ username }: usernameLinkProps) {
  return <Link to={`/${createLookupName(username)}`}>{username}</Link>;
}
