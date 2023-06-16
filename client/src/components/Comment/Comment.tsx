import "./Comment.css";

interface commentProps {
  small: boolean;
  paragraphs: string[];
}
export function Comment() {
  return <div className="comment">This is a comment on a poll</div>;
}
