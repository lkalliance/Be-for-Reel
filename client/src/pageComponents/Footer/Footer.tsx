// This component renders the footer for all pages

import "./Footer.css";
import logo from "./imdb-icon-20.png";

export function Footer() {
  // footer code
  return (
    <footer>
      <span>Be real about your favorite reels. </span>Powered by{" "}
      <a href="http://imdb.com" target="_blank" rel="noreferrer">
        <img src={logo} alt="IMDb" />
      </a>
    </footer>
  );
}
