// This compnent renders the page header

import "./Header.css";
import { Nav } from "../../components";

interface headerProps {
  uname: string;
  lookup: string;
}

export function Header({ uname, lookup }: headerProps) {
  return (
    <header>
      <img src="/b4r-full.png" alt="Be for Reel" />
      <Nav uname={uname} lookup={lookup} />
    </header>
  );
}
