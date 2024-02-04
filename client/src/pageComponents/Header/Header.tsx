// This component renders the page header

import "./Header.css";
import { Dispatch, SetStateAction } from "react";
import { HeaderNav } from "../../pageComponents";

interface headerProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

export function Header({ loggedIn, setLogIn }: headerProps) {
  return (
    <header>
      <HeaderNav loggedIn={loggedIn} setLogIn={setLogIn} />
    </header>
  );
}
