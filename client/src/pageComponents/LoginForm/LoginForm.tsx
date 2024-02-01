// This component renders the login form

import "./LoginForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { loginState } from "../../utils/interfaces";
import { LOGIN, FORGOT_PWD } from "../../utils/mutations";
import { AuthService } from "../../utils/auth";
import { InputText, ForgotPwdModal } from "../../components";

export function LoginForm({
  setLogIn,
  stateObj,
  handleChange,
  clear,
  boolErr,
  setBoolErr,
}: loginState) {
  const Auth = new AuthService();
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { error, data }] = useMutation(LOGIN);
  const [forgotPwd, { error: pwdError, data: pwdData }] =
    useMutation(FORGOT_PWD);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields

    // if something is amiss and no handler passed down, exit
    if (!handleChange) return;
    handleChange(e);
  };

  const closeModal = () => {
    setForgot(false);
    setForgotEmail("");
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

      // if the return says it can't find the email, say so
      if (!reset.data?.forgotPwd.success)
        setErrorMessage(reset.data?.forgotPwd.message);
      else closeModal();
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
          close={closeModal}
          submitter={memoryHandler}
          errMess={errorMessage}
        />
      )}
    </>
  );
}
