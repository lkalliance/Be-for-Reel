// This component renders the page header

import "./Header.css";
import { Dispatch, SetStateAction } from "react";
import { HeaderNav } from "../../pageComponents";

interface headerProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
  abSwitch: Dispatch<SetStateAction<string>>;
  currentSwitch: string;
}

export function Header({
  loggedIn,
  setLogIn,
  abSwitch,
  currentSwitch,
}: headerProps) {
  const handleSwitch = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    abSwitch(id);
  };
  return (
    <header>
      <div id="switch">
        <span
          onClick={handleSwitch}
          id="a"
          className={currentSwitch === "a" ? "selected" : ""}
        >
          A
        </span>
        <span
          onClick={handleSwitch}
          id="b"
          className={currentSwitch === "b" ? "selected" : ""}
        >
          B
        </span>
      </div>
      <HeaderNav loggedIn={loggedIn} setLogIn={setLogIn} />
    </header>
  );
}
