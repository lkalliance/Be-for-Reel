// This component renders a poll question

/* REQUIRED PROPS:
question: string of the text of the poll question
description: string of the description of the poll
username: string of the username of the poll's creator */

import "./Question.css";
import { UsernameLink } from "../../components";

interface questionProps {
  question: string;
  description?: string;
  username: string;
}

export function Question({ question, description, username }: questionProps) {
  return (
    <div>
      <h2>{question}</h2>
      {description ? <p className="desc">{description}</p> : ""}
      <h4>
        <UsernameLink username={username} />
      </h4>
    </div>
  );
}
