import "./Directory.css";
import { PollListing } from "../../components";
import { samplePolls } from "../../utils/fakedata";

export function Directory() {
  return (
    <section id="directory">
      <ul>
        {samplePolls.map((poll, index) => {
          return (
            <PollListing
              key={index}
              index={index}
              poll={poll}
              voted={poll.voted}
            />
          );
        })}
      </ul>
    </section>
  );
}
