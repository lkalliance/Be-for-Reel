// This component renders the footer for all pages

import "./Footer.css";
import logo from "./imdb-icon-20.png";
import { Link } from "react-router-dom";

interface footerProps {
  quote: string;
}

export function Footer({ quote }: footerProps) {
  // footer code
  return (
    <footer>
      <span id="footer-text" className="user-data">
        {quote}
      </span>
      <div>
        <span>Be real about your favorite reels. </span>Powered by{" "}
        <a href="http://imdb.com" target="_blank" rel="noreferrer">
          <img src={logo} alt="IMDb" />
        </a>{" "}
        and
        <a
          id="to-tv-api"
          href="https://tv-api.com"
          target="_blank"
          rel="noreferrer"
        >
          TV-API
        </a>
      </div>
      <ul>
        <li>
          <Link to="/about">About us</Link>
        </li>
        <li>
          <Link to="/terms">Terms of Use</Link>
        </li>
        <li>
          <Link to="/contact">Contact Be for Reel</Link>
        </li>
      </ul>
    </footer>
  );
}
