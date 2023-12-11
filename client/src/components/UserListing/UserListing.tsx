import "./UserListing.css";
import { Link } from "react-router-dom";
import { userListProps } from "../../utils/interfaces";

interface userListingProps {
  user: userListProps;
}

export function UserListing({ user }: userListingProps) {
  const created_on = new Date(user.created);

  return (
    <div className="col col-12 col-md-6 col-xl-4">
      <div className="user-listing list-member-12">
        <Link className="reverse" to={`/${user.lookupName}`}>
          {user.userName}
        </Link>
        <p className="sub-info">member since {created_on.getFullYear()}</p>
        <p>
          {` ${user.polls} poll`}
          {user.polls !== 1 ? "s" : ""}, {`${user.comments} comment`}
          {user.comments !== 1 ? "s" : ""}, and {`${user.votes} vote`}
          {user.votes !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
