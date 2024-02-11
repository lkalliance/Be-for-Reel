// This component renders the global alert modal

/* REQUIRED PROPS:
message: string for the modal
type: string "alert" or "success" for rendering alert coloring
close: function for closing the alert */

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
