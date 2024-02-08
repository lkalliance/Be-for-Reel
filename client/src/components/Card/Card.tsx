// This component renders a home page featured poll card

/* REQUIRED PROPS:
title: the title of the poll
urlTitle: the url of the poll
poster: the url of the movie poster
user: the user that created the poll
votes: the integer number of votes cast on the poll
num: index of which card this is on the page
voted: what the current user voted on this poll */

import "./Card.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { UsernameLink } from "../../components";

interface cardProps {
  title: string;
  urlTitle: string;
  poster: string;
  user: string;
  votes: number;
  num: number;
  voted: string | undefined;
}

export function Card({
  title,
  poster,
  urlTitle,
  user,
  votes,
  num,
  voted,
}: cardProps) {
  return (
    <div className="col">
      <div
        className={`card custom-card${num === 0 && " first-card"}`}
        style={{ backgroundImage: `url(${poster})` }}
      >
        {voted && (
          <FontAwesomeIcon icon={faCheckCircle} className="card-check" />
        )}
        <Link to={urlTitle} className="main-link">
          <h5 className="card-title">
            {voted && (
              <FontAwesomeIcon icon={faCheckCircle} className="title-check" />
            )}
            {title}
          </h5>
        </Link>
        <div className="poll-info">
          <UsernameLink username={user} />
          <div className="vote-count">votes: {votes}</div>
        </div>
      </div>
    </div>
  );
}
