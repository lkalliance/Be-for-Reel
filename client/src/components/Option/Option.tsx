// This component renders a voting option

import "./Option.css";
import { optionProps } from "../../utils";

interface optProps {
  opt: optionProps;
  poll: string;
  voted: string | undefined;
  votes: number | undefined;
  handleVote: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Option({ opt, voted, votes, poll, handleVote }: optProps) {
  return (
    <div className="option">
      <h2>{opt.movie}</h2>
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
          {voted ? (
            <div>{`${votes} vote${votes !== 1 ? "s" : ""}`}</div>
          ) : (
            <button
              id={`${opt.movie}&&&${poll}&&&${opt._id}&&&${opt.imdb_id}`}
              onClick={handleVote}
            >
              Vote for me!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
