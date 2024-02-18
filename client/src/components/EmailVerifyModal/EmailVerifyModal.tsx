// This component notifies the user to look for email confirmation

/* REQUIRED PROPS:
close: function to close the modal
email: the email address that was provided by the user */

import "./EmailVerifyModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";

interface emailVerifyProps {
  close: () => void;
  email: string | undefined;
}

export function EmailVerifyModal({ close, email }: emailVerifyProps) {
  return (
    <div id="email-verify-modal" className="main-modal">
      <div className="list-member-12">
        A confirmation email has been sent to{" "}
        <span className="user-data">{email}</span>. Click on the link in the
        email to confirm your account. This message will self-destruct in two
        hours.
        <FontAwesomeIcon icon={faXmarkSquare} onClick={close} />
      </div>
    </div>
  );
}
