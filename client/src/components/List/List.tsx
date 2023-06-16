import "./List.css";

interface listProps {
  small: boolean;
  paragraphs: string[];
}
export function List() {
  return <div className="list">This is a list of polls</div>;
}
