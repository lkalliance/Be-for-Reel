// This component renders a user profile page

import "./Profile.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { PollList, CommentList, Tabs } from "../../components";

export function Profile() {
  const auth = new AuthService();
  const whoIsThis = auth.getProfile().lookupName;
  const confirmed = auth.getProfile().confirmed;
  const email = auth.getProfile().email;
  const { username } = useParams();
  const thisUser = whoIsThis === username;
  const [whichTab, setTab] = useState("polls");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, data } = useQuery(QUERY_SINGLE_USER, {
    variables: { lookupname: username },
  });

  const userData = data?.getUser || {};
  const createdOn = new Date(userData.created);

  const tabHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    if (id === "polls" || id === "comments") setTab(id);
  };

  return (
    <section id="profile">
      {/* <div className="row"> */}
      {userData.created ? (
        // the user exists, render their data
        <>
          <h1 className="col col-12">{userData.userName}</h1>
          <h4 className="col col-12 sub-info">{`member since ${createdOn.getFullYear()}`}</h4>
          {!confirmed && thisUser && (
            <div className="alert alert-danger">
              Account not yet activated. Check {email} for confirmation email.
            </div>
          )}
          <Tabs
            list={["polls", "comments"]}
            current={whichTab}
            handler={tabHandler}
          />
          {userData && whichTab === "polls" && (
            <PollList
              polls={userData.polls}
              thisUser={thisUser}
              uName={username}
            />
          )}
          {userData && whichTab === "comments" && (
            <CommentList comments={userData.comments} thisUser={thisUser} />
          )}
        </>
      ) : (
        // the user doesn't exist, tell the user so
        <div className="doesnt-exist list-member-20">
          The user <span>{username}</span> does not exist.
        </div>
      )}
      {/* </div> */}
    </section>
  );
}
