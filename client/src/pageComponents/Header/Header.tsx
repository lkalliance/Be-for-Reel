// This component renders the page header

/* REQUIRED PROPS:
uname: full username
lookup: unique lookup string for user */

import "./Header.css";
import { HeaderNav } from "../../pageComponents";

interface headerProps {
  uname: string;
  lookup: string;
}

export function Header({ uname, lookup }: headerProps) {
  return (
    <header>
      <HeaderNav uname={uname} lookup={lookup} />
    </header>
  );
}
