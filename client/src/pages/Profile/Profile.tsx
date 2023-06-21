import "./Profile.css";
import { sampleUser } from "../../utils";

export function Profile() {
  return (
    <section id="profile">
      <>
        <h2>{sampleUser.username}</h2>
        <h3>Polls</h3>
        {sampleUser.polls.map((poll, index) => {
          return (
            <div key={index}>
              <a href={`/poll/${poll.poll_id}`}>{poll.title}</a>{" "}
              {`(${poll.votes} votes, ${poll.comments} comments)`}
            </div>
          );
        })}
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
    </section>
  );
}
