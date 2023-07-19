// This component renders a voting option

import "./Option.css";
import { optionProps } from "../../utils";

interface optProps {
  opt: optionProps;
  voted: boolean;
}

export function Option({ opt, voted }: optProps) {
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
          {voted ? "" : <button>Vote for me!</button>}
        </div>
      </div>
    </div>
  );
}
