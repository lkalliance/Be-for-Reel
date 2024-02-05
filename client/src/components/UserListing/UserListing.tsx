// This component renders a single user listing on a list of users

/* REQUIRED PROPS:
user:
  --user_id
  --userName
  --lookupName (unique string for database lookup)
  --created
  --polls (number created by user)
  --votes (number submitted by user)
  --comments (number left by user) */

import "./UserListing.css";
import { Link } from "react-router-dom";
import { userListProps } from "../../utils/interfaces";

interface userListingProps {
  user: userListProps;
}

export function UserListing({ user }: userListingProps) {
  const created_on = new Date(user.created);

  return (
    <div className="user-listing list-member-12">
      <p>
        <Link className="reverse" to={`/${user.lookupName}`}>
          {user.userName}
        </Link>
        <span className="sub-info">
          member since {created_on.getFullYear()}
        </span>
        <span className="user-info">
          {` ${user.polls} poll`}
          {user.polls !== 1 ? "s" : ""}, {`${user.comments} comment`}
          {user.comments !== 1 ? "s" : ""}, and {`${user.votes} vote`}
          {user.votes !== 1 ? "s" : ""}
        </span>
      </p>
    </div>
  );
}
