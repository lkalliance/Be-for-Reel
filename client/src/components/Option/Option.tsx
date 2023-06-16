import "./Option.css";
import { optionProps } from "../../utils/interfaces";

interface optProps {
  opt: optionProps;
}

export function Option({ opt }: optProps) {
  return (
    <div className="option">
      <h2>{opt.title}</h2>
      <div>{opt.stars}</div>
      <div className="optinfo">
        <img src={opt.image} alt={opt.title} />
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
        </div>
      </div>
    </div>
  );
}
