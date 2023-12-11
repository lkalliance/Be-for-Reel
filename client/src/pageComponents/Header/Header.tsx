// This compnent renders the page header

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
