// This component renders a voting option

import "./Option.css";
import { optionProps } from "../../utils";

interface optProps {
  opt: optionProps;
  poll: string;
  voted: string | undefined;
  votes: number | undefined;
  loggedIn: boolean;
  handleVote: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Option({
  opt,
  voted,
  votes,
  poll,
  handleVote,
  loggedIn,
}: optProps) {
  return (
    <div className="option">
      <h3>{opt.movie}</h3>
      <div>{opt.stars}</div>
      <div className="optinfo">
        <img src={opt.image} alt={opt.movie} />
        <div>
          {opt.plot}
          <a
            href={`https://www.imdb.com/title/${opt.imdb_id}/`}
            target="_blank"
            rel="noreferrer"
          >
            IMDb
          </a>
          <a href={opt.wikipedia} target="_blank" rel="noreferrer">
            Wikipedia
          </a>
          <a href={opt.trailer} target="_blank" rel="noreferrer">
            Trailer
          </a>

          {loggedIn ? (
            // user is logged in: show a vote button or the vote total
            voted ? (
              // user has voted: show the vote total for this option
              <div>{`${votes} vote${votes !== 1 ? "s" : ""}`}</div>
            ) : (
              // user has not voted: show the vote button
              <button
                // id contains data on its movie, poll, and more
                id={`${opt.movie}&&&${poll}&&&${opt._id}&&&${opt.imdb_id}`}
                onClick={handleVote}
              >
                Vote for me!
              </button>
            )
          ) : (
            // user is not logged in, show neither vote total nor button
            ""
          )}
        </div>
      </div>
    </div>
  );
}
