import "./UserDir.css";
import { AuthService } from "../../utils/auth";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { listSection } from "../../utils";
import { userListProps } from "../../utils/interfaces";
import { QUERY_ALL_USERS } from "../../utils/queries";
import { UserListing, Pagination } from "../../components";

export function UserDir() {
  const auth = new AuthService();
  const { userName } = auth.getProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // get the user list
  const { loading, data } = useQuery(QUERY_ALL_USERS);
  const userList = loading ? [] : data.getUsers.users;
  const showThis = listSection(userList, currentPage, perPage);

  const handlePageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPage(parseInt(id.split("-")[1]));
  };

  return (
    <section id="user-directory">
      <h1>Users</h1>
      <ul>
        {loading ? (
          <li className="list-item-12">loading users</li>
        ) : (
          showThis.map((user: userListProps, index: number) => {
            const current = user.userName === userName;
            return <UserListing key={index} user={user} current={current} />;
          })
        )}
      </ul>
      <Pagination
        navHandler={handlePageSelect}
        currentPage={currentPage}
        totalCount={userList.length}
        pageSize={perPage}
        siblingCount={1}
      />
    </section>
  );
}
