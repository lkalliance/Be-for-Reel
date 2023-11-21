// This component renders a user profile page

import "./Profile.css";
import { Key } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { userCommentProps } from "../../utils/interfaces";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { PollList } from "../../components";

export function Profile() {
  const { username } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, data } = useQuery(QUERY_SINGLE_USER, {
    variables: { lookupname: username },
  });

  const userData = data?.getUser || {};
  const createdOn = new Date(userData.created);

  return (
    <section id="profile" className="container">
      <div className="row">
        {userData.created ? (
          // the user exists, render their data
          <>
            <h1 className="col col-12">{userData.userName}</h1>
            <h4 className="col col-12">{`member since ${createdOn.getFullYear()}`}</h4>

            {userData ? (
              <div className="col col-12 col-sm-6">
                <PollList polls={userData.polls} />
              </div>
            ) : (
              ""
            )}
            <div className="col col-12 col-sm-6">
              <h2>Comments</h2>
              {userData.comments.map(
                (comment: userCommentProps, index: Key) => {
                  return (
                    <div className="comment" key={index}>
                      <h5>
                        <Link to={comment.urlTitle}>{comment.title}</Link>
                      </h5>
                      <p className="your-vote">{`Your vote: "${comment.movie}"`}</p>
                      <p>{comment.text}</p>
                    </div>
                  );
                }
              )}
            </div>
          </>
        ) : (
          // the user doesn't exist, tell the user so
          <div>
            The user <span>{username}</span> does not exist.
          </div>
        )}
      </div>
    </section>
  );
}
