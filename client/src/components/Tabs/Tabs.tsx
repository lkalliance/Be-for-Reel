// This component renders a set of selectable tabs

/* REQUIRED PROPS:
list: list of strings for button IDs and text
current: string representing the currently selected tab
handler: callback for clicking on a tab */

import "./Tabs.css";

interface customTabsProps {
  list: string[];
  current: string;
  beta?: string;
  handler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Tabs({ list, handler, current, beta }: customTabsProps) {
  return (
    <div className="tab-container">
      {list.map((tab, index) => {
        return (
          <button
            key={index}
            id={tab}
            className={`btn user-data ${current === tab && "active"}${
              beta && beta === tab ? " beta" : ""
            }`}
            onClick={handler}
          >
            {beta && beta === tab && <span className="beta">beta</span>}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        );
      })}
    </div>
  );
}
