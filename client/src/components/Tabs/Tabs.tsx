// This component renders a set of selectable tabs

/* REQUIRED PROPS:
list: list of strings for button IDs and text
current: string representing the currently selected tab
handler: callback for clicking on a tab */

import "./Tabs.css";

interface customTabsProps {
  list: string[];
  current: string;
  handler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Tabs({ list, handler, current }: customTabsProps) {
  return (
    <div className="tab-container">
      {list.map((tab, index) => {
        return (
          <button
            key={index}
            id={tab}
            className={`btn ${current === tab ? "active" : ""}`}
            onClick={handler}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        );
      })}
    </div>
  );
}