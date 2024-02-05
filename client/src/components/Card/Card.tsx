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
  votes: number;
}

export function Card({ title, poster, urlTitle, user, votes }: cardProps) {
  return (
    <div className="col">
      <div
        className="card custom-card"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <Link to={urlTitle} className="main-link">
          <h5 className="card-title">{title}</h5>
        </Link>
        <div className="poll-info">
          <UsernameLink username={user} />
          <div>votes: {votes}</div>
        </div>
      </div>
    </div>
  );
}
