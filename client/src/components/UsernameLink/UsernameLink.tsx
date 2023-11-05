// This components renders a single poll listing on a list of polls

import "./UsernameLink.css";
import { Link } from "react-router-dom";
import { createLookupName } from "../../utils";

interface usernameLinkProps {
  username: string;
}

export function UsernameLink({ username }: usernameLinkProps) {
  return <Link to={`/${createLookupName(username)}`}>{username}</Link>;
}
