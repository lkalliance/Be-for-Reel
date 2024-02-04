// This component renders the login form

import "./LoginForm.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { loginState } from "../../utils/interfaces";
import { LOGIN, FORGOT_PWD, RESET_PWD } from "../../utils/mutations";
import { AuthService } from "../../utils/auth";
import { InputText, ForgotPwdModal, ResetPwdModal } from "../../components";

export function LoginForm({
  setLogIn,
  stateObj,
  handleChange,
  clear,
  boolErr,
  setBoolErr,
}: loginState) {
  const Auth = new AuthService();
  const navigate = useNavigate();
  const params = useParams();
  const isForgotten = window.location.hash.indexOf("pwd") >= 0;
  const eToken = params.eToken;
  const [forgot, setForgot] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reset, setReset] = useState(eToken && eToken.length > 0);
  const [resetPassword, setResetPwd] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login] = useMutation(LOGIN);
  const [forgotPwd] = useMutation(FORGOT_PWD);
  const [resetPwd] = useMutation(RESET_PWD);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields

    // if something is amiss and no handler passed down, exit
    if (!handleChange) return;
    handleChange(e);
  };

  const closeForgotModal = () => {
    setForgot(false);
    setForgotEmail("");
    setErrorMessage("");
  };

  const closeResetModal = () => {
    setReset(false);
    setResetPwd("");
    setErrorMessage("");
    navigate("/login");
  };

  const memoryHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // send the email to the back end
      const reset = await forgotPwd({
        variables: {
          email: forgotEmail,
        },
      });

      if (reset.data?.forgotPwd.success) {
        // if the return says it succeeded, send the email
        await axios.post("/api/email/forgot-pwd", {
          forgotEmail,
        });
      }

      // if the return says it can't find the email, say so
      if (!reset.data?.forgotPwd.success)
        setErrorMessage(reset.data?.forgotPwd.message);
      else closeForgotModal();
    } catch (err) {
      console.log(err);
    }
  };

  const resetHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // do the mutation
      const reset = await resetPwd({
        variables: {
          eToken,
          newPwd: resetPassword,
        },
      });

      closeResetModal();
      console.log(reset.data?.forgotPwd.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    // Handler for login submission
    e.preventDefault();
    if (!stateObj) return;
    if (!(stateObj.lUsername && stateObj.lPassword)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Clear the login form
    if (clear) clear("login");

    try {
      const { data } = await login({
        variables: {
          userName: stateObj.lUsername,
          password: stateObj.lPassword,
        },
      });

      // store the login token
      Auth.login(data.login.token);
      setLogIn(true);
    } catch (err) {
      if (clear) clear("login");
      if (setBoolErr) setBoolErr(true);
      console.log(err);
    }
  };

  return (
    <>
      <div id="loginFormContainer">
        <h1>Log in</h1>
        <form>
          <InputText
            type="text"
            label="username or email"
            val={stateObj ? stateObj.lUsername : ""}
            setValue={handleInputChange}
            capitalize="off"
            id="lUsername"
          />
          <InputText
            type="password"
            label="password"
            val={stateObj ? stateObj.lPassword : ""}
            setValue={handleInputChange}
            id="lPassword"
          />
          <div id="forgot-pwd">
            <a
              href="@"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setForgot(true);
              }}
            >
              I forgot my password
            </a>
          </div>
          <button
            type="submit"
            disabled={
              stateObj ? !(stateObj.lUsername && stateObj.lPassword) : false
            }
            onClick={handleLoginSubmit}
            className="btn btn-primary"
          >
            Log in
          </button>
          {boolErr && (
            <div className="alert alert-danger">
              Incorrect login credentials
            </div>
          )}
        </form>
      </div>
      {forgot && (
        <ForgotPwdModal
          val={forgotEmail}
          setter={setForgotEmail}
          close={closeForgotModal}
          submitter={memoryHandler}
          errMess={errorMessage}
        />
      )}
      {isForgotten && (
        <ResetPwdModal
          eToken={eToken}
          val={resetPassword}
          setter={setResetPwd}
          close={closeResetModal}
          submitter={resetHandler}
          errMess={errorMessage}
        />
      )}
    </>
  );
}
