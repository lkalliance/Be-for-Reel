// This component renders a link to deactivate or edit a poll

/* REQUIRED PROPS:
text: the text of the link
handler: the callback for this link
pollId: the poll being acted on */

import "./ActionLink.css";

interface actionLinkProps {
  text: string;
  handler: (e: React.MouseEvent<HTMLElement>) => void;
  pollId: string;
}

export function ActionLink({ text, handler, pollId }: actionLinkProps) {
  return (
    <div className={`${text}-link`}>
      <span data-id={pollId} onClick={handler}>
        {`${text}`} poll
      </span>
    </div>
  );
}
