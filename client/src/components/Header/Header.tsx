// This compnent renders the page header

import "./Header.css";
import { Nav } from "../../components";

interface headerProps {
  uname: string;
}

export function Header({ uname }: headerProps) {
  return (
    <header>
      <img src="/b4r-full.png" alt="Be for Reel" />
      <Nav uname={uname} />
    </header>
  );
}
