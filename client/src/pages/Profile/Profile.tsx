// This component renders a user profile page

import "./Profile.css";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { PollList } from "../../components";
import { sampleUser } from "../../utils";

export function Profile() {
  const { username } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_USER, {
    variables: { username },
  });

  const userData = data?.getUser || {};
  const createdOn = new Date(userData.created);

  return (
    <section id="profile">
      {userData.created ? (
        <>
          <h2>{userData.userName}</h2>
          <p>{`member since ${createdOn.getFullYear()}`}</p>
          {userData ? <PollList polls={sampleUser.polls} /> : <div></div>}
          <h3>Comments</h3>
          {sampleUser.comments.map((comment, index) => {
            return (
              <div key={index}>
                <h4>{comment.movie}</h4>
                {comment.text}
                <div>
                  poll: <a href={`/poll/${comment.poll_id}`}>{comment.title}</a>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div>
          The user <span>{username}</span> does not exist.
        </div>
      )}
    </section>
  );
}
