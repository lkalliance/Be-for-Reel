import "./ResetPwdModal.css";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "../InputText";

interface resetProps {
  eToken: string | undefined;
  val: string;
  setter: Dispatch<SetStateAction<string>>;
  close: () => void;
  submitter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  errMess: string;
}

export function ResetPwdModal({
  eToken,
  val,
  setter,
  close,
  submitter,
  errMess,
}: resetProps) {
  const navigate = useNavigate();
  const pwdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const removeSpaces = value.replaceAll(" ", "");
    setter(removeSpaces);
  };

  return (
    <div id="reset-password-modal">
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
