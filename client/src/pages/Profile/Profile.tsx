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
          <h2>{userData.userName}</h2>
          <p>{`member since ${createdOn.getFullYear()}`}</p>
          {userData ? <PollList polls={userData.polls} /> : <div></div>}
          <h3>Comments</h3>
          {userData.comments.map((comment: userCommentProps, index: Key) => {
            return (
              <div key={index}>
                <h4>{comment.title}</h4>
                <h6>{comment.movie}</h6>
                {comment.text}
                <div>
                  poll: <Link to={comment.urlTitle}>{comment.title}</Link>
                </div>
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
