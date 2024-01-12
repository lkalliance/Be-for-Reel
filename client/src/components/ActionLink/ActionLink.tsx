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
