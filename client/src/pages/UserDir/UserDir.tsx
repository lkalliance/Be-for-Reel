import "./UserDir.css";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { userListProps } from "../../utils/interfaces";
import { QUERY_ALL_USERS } from "../../utils/queries";
import { UserListing, InputText } from "../../components";

export function UserDir() {
  // get the user list
  const [search, setSearch] = useState("");
  const { loading, data } = useQuery(QUERY_ALL_USERS);
  const userList = loading ? [] : data.getUsers.users;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  return (
    <section id="user-directory" className="container">
      <h1>Users</h1>

      <div className="row">
        <div className="col col-12">
          <div className="col col-12 col-md-6 col-xl-8">
            <InputText
              id="userSearch"
              type="text"
              classN="darker"
              placeholder="Filter users"
              val={search}
              setValue={handleSearchChange}
            />
          </div>
        </div>
        {loading
          ? "users go here"
          : userList.map((user: userListProps, index: number) => {
              const searchFilter =
                search === "" ||
                user.userName.toLowerCase().indexOf(search.toLowerCase()) > -1;
              return searchFilter && <UserListing key={index} user={user} />;
            })}
      </div>
    </section>
  );
}
