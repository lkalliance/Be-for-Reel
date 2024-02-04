import "./AlertModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";

interface alertModalProps {
  message: string;
  type: "alert" | "success";
  close: () => void;
}

export function AlertModal({ message, type, close }: alertModalProps) {
  return (
    <div className="main-modal">
      <div
        id="main-alert"
        className={`alert ${
          type === "alert" ? "alert-danger" : "alert-primary"
        }`}
      >
        {message}
        <FontAwesomeIcon icon={faXmarkSquare} onClick={close} />
      </div>
    </div>
  );
}
