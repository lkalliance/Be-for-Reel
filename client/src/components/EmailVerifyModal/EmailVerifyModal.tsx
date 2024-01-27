import "./EmailVerifyModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";

interface emailVerifyProps {
  close: () => void;
  email: string | undefined;
}

export function EmailVerifyModal({ close, email }: emailVerifyProps) {
  return (
    <div id="email-verify-modal">
      <div className="list-member-12">
        A confirmation email has been sent to {email}.
        <FontAwesomeIcon icon={faXmarkSquare} onClick={close} />
      </div>
    </div>
  );
}
