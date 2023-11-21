// This compnent renders the page header

import "./Header.css";
import { Link } from "react-router-dom";
import { HeaderNav } from "../../pageComponents";

interface headerProps {
  uname: string;
  lookup: string;
}

export function Header({ uname, lookup }: headerProps) {
  return (
    <header>
      {/* <Link to="/">
        <img src="/b4r-full.png" alt="Be for Reel" />
      </Link> */}
      <HeaderNav uname={uname} lookup={lookup} />
    </header>
  );
}
