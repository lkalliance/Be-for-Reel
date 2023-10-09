// This component renders a home page featured poll card

import "./Card.css";
import { Link } from "react-router-dom";

interface cardProps {
  title: string;
  urlTitle: string;
  poster: string;
  user: string;
}

export function Card({ title, poster, urlTitle, user }: cardProps) {
  return (
    <div className="card">
      <h2>
        <Link to={urlTitle}>{title}</Link>
      </h2>
      <h4>{user}</h4>
      <img src={poster} alt={title} />
    </div>
  );
}
