// This component renders a user profile page

import "./Profile.css";
import { Key } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { userCommentProps } from "../../utils/interfaces";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { PollList } from "../../components";

export function Profile() {
  const auth = new AuthService();
  const whoIsThis = auth.getProfile().lookupName;
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
            <h4 className="col col-12 sub-info">{`member since ${createdOn.getFullYear()}`}</h4>

            {userData ? (
              <div className="col col-12 col-sm-6">
                <PollList
                  polls={userData.polls}
                  thisUser={whoIsThis === username}
                  uName={username}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col col-12 col-sm-6">
              <h3>Comments</h3>
              <ul>
                {userData.comments.map(
                  (comment: userCommentProps, index: Key) => {
                    return (
                      <li className="comment list-member-12" key={index}>
                        <Link to={comment.urlTitle} className="reverse">
                          {comment.title}
                        </Link>
                        <p className="sub-info">
                          You voted for{" "}
                          <span className="your-vote">{`${comment.movie}`}</span>
                        </p>
                        <p className="comment-text">{comment.text}</p>
                      </li>
                    );
                  }
                )}
              </ul>
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
