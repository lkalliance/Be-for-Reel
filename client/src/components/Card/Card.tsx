// This component renders a home page featured poll card

/* REQUIRED PROPS:
Title: the title of the poll
urlTitle: the url of the poll
poster: the url of the movie poster
user: the user that created the poll */

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
