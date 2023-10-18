// This component renders a poll question

import "./Question.css";
import { UsernameLink } from "../../components";

interface questionProps {
  question: string;
  description: string;
  username: string;
}

export function Question({ question, description, username }: questionProps) {
  return (
    <div className="question">
      <h1>{question}</h1>
      <div>{description}</div>
      <h4>
        <UsernameLink username={username} />
      </h4>
    </div>
  );
}
