// This component handles the modal to accept the user's new password

/* REQUIRED PROPS:
val: the current string entered into the password field
setter: handler to record changes to the user's input
close: function to close the modal
submitter: handler for when user clicks Submit
errMess: string of the error message to show if needed */

import "./ResetPwdModal.css";
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "../InputText";

interface resetProps {
  val: string;
  setter: Dispatch<SetStateAction<string>>;
  close: () => void;
  submitter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  errMess: string;
}

export function ResetPwdModal({
  val,
  setter,
  close,
  submitter,
  errMess,
}: resetProps) {
  const pwdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const removeSpaces = value.replaceAll(" ", "");
    setter(removeSpaces);
  };

  return (
    <div id="reset-password-modal" className="main-modal">
      <div id="reset-contents" className="list-member-12">
        <InputText
          type="password"
          label="Enter a new password"
          id="reset-pwd"
          min={8}
          val={val}
          setValue={pwdChangeHandler}
        />
        <button
          className="btn btn-primary"
          onClick={submitter}
          disabled={val.length < 8}
        >
          Reset password
        </button>
        {errMess.length > 0 && (
          <div className="alert alert-danger">{errMess}</div>
        )}
        <FontAwesomeIcon icon={faXmarkSquare} onClick={close} />
      </div>
    </div>
  );
}
