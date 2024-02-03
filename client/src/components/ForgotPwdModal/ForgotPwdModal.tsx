import "./ForgotPwdModal.css";
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "../InputText";
import { validateEmail } from "../../utils/typeUtils";

interface forgotProps {
  val: string;
  setter: Dispatch<SetStateAction<string>>;
  close: () => void;
  submitter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  errMess: string;
}

export function ForgotPwdModal({
  val,
  setter,
  close,
  submitter,
  errMess,
}: forgotProps) {
  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setter(value);
  };

  return (
    <div id="forgot-password-modal" className="main-modal">
      <div id="forgot-contents" className="list-member-12">
        Forgot your password? Enter the email address to the account in the
        field below.
        <InputText
          type="email"
          id="forgot-email"
          val={val}
          setValue={emailChangeHandler}
        />
        <button
          className="btn btn-primary"
          onClick={submitter}
          disabled={validateEmail(val)}
        >
          Send link
        </button>
        {errMess.length > 0 && (
          <div className="alert alert-danger">{errMess}</div>
        )}
        <FontAwesomeIcon icon={faXmarkSquare} onClick={close} />
      </div>
    </div>
  );
}
