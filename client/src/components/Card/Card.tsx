// This component renders a home page featured poll card

import "./Card.css";
import { Link } from "react-router-dom";
import { UsernameLink } from "../../components";

interface cardProps {
  title: string;
  urlTitle: string;
  poster: string;
  user: string;
}

export function Card({ title, poster, urlTitle, user }: cardProps) {
  console.log(`This card thinks the user is ${user}`);
  return (
    <div className="card">
      <h2>
        <Link to={urlTitle}>{title}</Link>
      </h2>
      <h3>
        <UsernameLink username={user} />
      </h3>
      <img src={poster} alt={title} />
    </div>
  );
}
