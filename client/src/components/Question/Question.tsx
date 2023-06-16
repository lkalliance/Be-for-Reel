import "./Question.css";

interface questionProps {
  q: string;
  d: string;
}

export function Question({ q, d }: questionProps) {
  return (
    <div className="question">
      <h1>{q}</h1>
      <div>{d}</div>
    </div>
  );
}
