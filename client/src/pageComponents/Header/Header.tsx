// This compnent renders the page header

import "./Header.css";
import { Nav } from "../../pageComponents";
import { Link } from "react-router-dom";

interface headerProps {
  uname: string;
  lookup: string;
}

export function Header({ uname, lookup }: headerProps) {
  return (
    <header>
      <Link to="/">
        <img src="/b4r-full.png" alt="Be for Reel" />
      </Link>
      <Nav uname={uname} lookup={lookup} />
    </header>
  );
}
