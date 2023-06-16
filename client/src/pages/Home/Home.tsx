import "./Home.css";
import { Card } from "../../components";
import { pollProps } from "../../utils/interfaces";

interface homeProps {
  polls: pollProps[];
}

export function Home({ polls }: homeProps) {
  return (
    <section id="home">
      {polls.map((poll: pollProps, index: number) => {
        const which = index > 3 ? 3 : index;
        return (
          <Card
            key={index}
            title={poll.title}
            image={poll.options[which].image}
            index={index}
          />
        );
      })}
    </section>
  );
}
