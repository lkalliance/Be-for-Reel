import "./Poll.css";
import { samplePolls } from "../../utils/fakedata";
import { useParams } from "react-router-dom";

import { Question } from "../../components";
import { Option } from "../../components";

export function Poll() {
  const { pollId } = useParams();
  if (Number(pollId) >= samplePolls.length) {
    window.location.href = "/";
  }
  const poll = samplePolls[Number(pollId)];
  return (
    <section id="poll">
      <Question q={poll.title} d={poll.description} />
      {poll.options.map((option, index) => {
        return <Option key={index} opt={option} voted={poll.voted} />;
      })}
    </section>
  );
}
