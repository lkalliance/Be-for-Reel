import "./UserDir.css";
import { useQuery } from "@apollo/client";
import { userListProps } from "../../utils/interfaces";
import { QUERY_ALL_USERS } from "../../utils/queries";
import { UserListing } from "../../components";

export function UserDir() {
  // get the user list
  const { loading, data } = useQuery(QUERY_ALL_USERS);
  const userList = loading ? [] : data.getUsers.users;
  return (
    <section id="user-directory" className="container">
      <h1>Users</h1>
      <div className="row">
        {loading
          ? "users go here"
          : userList.map((user: userListProps, index: number) => {
              return <UserListing key={index} user={user} />;
            })}
      </div>
    </section>
  );
}
