// This component renders a user profile page

import "./Profile.css";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { PollList } from "../../components";
import { userCommentProps } from "../../utils/interfaces";
import { Key } from "react";
import { Link } from "react-router-dom";

export function Profile() {
  const { username } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, data } = useQuery(QUERY_SINGLE_USER, {
    variables: { lookupname: username },
  });

  const userData = data?.getUser || {};
  const createdOn = new Date(userData.created);

  return (
    <section id="profile">
      {userData.created ? (
        // the user exists, render their data
        <>
          <h1>{userData.userName}</h1>
          <h4>{`member since ${createdOn.getFullYear()}`}</h4>
          {userData ? <PollList polls={userData.polls} /> : <div></div>}
          <h2>Comments</h2>
          {userData.comments.map((comment: userCommentProps, index: Key) => {
            return (
              <div key={index}>
                <h3>
                  poll: <Link to={comment.urlTitle}>{comment.title}</Link>
                </h3>
                <h4>{`Your vote: "${comment.movie}"`}</h4>
                <p>{comment.text}</p>
              </div>
            );
          })}
        </>
      ) : (
        // the user doesn't exist, tell the user so
        <div>
          The user <span>{username}</span> does not exist.
        </div>
      )}
    </section>
  );
}
