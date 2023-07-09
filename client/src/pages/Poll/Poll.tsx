import "./Poll.css";
import { samplePolls } from "../../utils";
import { useParams, Navigate } from "react-router-dom";

import { Question } from "../../components";
import { Option } from "../../components";

export function Poll() {
  const { pollId } = useParams();

  const poll =
    Number(pollId) < samplePolls.length ? samplePolls[Number(pollId)] : false;

  return (
    <section id="poll">
      {poll ? (
        <>
          <Question q={poll.title} d={poll.description} />
          {poll.options.map((option, index) => {
            return <Option key={index} opt={option} voted={poll.voted} />;
          })}
        </>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </section>
  );
}
