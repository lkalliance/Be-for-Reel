// This component renders the home page

import "./Home.css";
import { Card } from "../../components";
import { pollProps } from "../../utils";

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
            image="https://m.media-amazon.com/images/M/MV5BZTY3YjYxZGQtMTM2YS00ZmYwLWFlM2QtOWFlMTU1NTAyZDQ2XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_Ratio0.6762_AL_.jpg}"
            index={index}
          />
        );
      })}
    </section>
  );
}
