// This component renders the footer for all pages

import "./Footer.css";
import logo from "./imdb-icon-20.png";

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
        </a>
      </div>
    </footer>
  );
}
