// This component renders the signup form

/* REQUIRED PROPS:
setLogIn: sets flag for user logged in
stateObj: contains login data
handleChange: handles user input into login fields
clear: utility function to clear all login fields
formSetter: handler to manipulate the state holding form inputs
strErr: state holding the text string for the error alert
setStrErr: sets the text for the error alert */

import "./SignupForm.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import axios from "axios";
import { AuthService } from "../../utils/auth";
import { accountLimits } from "../../utils/typeUtils";
import { loginState } from "../../utils/interfaces";
import { ADD_USER } from "../../utils/mutations";
import { InputText, EmailVerifyModal, EmailTokenModal } from "../../components";

interface formData {
  [key: string]: string;
}

export function SignupForm({
  setLogIn,
  stateObj,
  handleChange,
  clear,
  formSetter,
  strErr,
  setStrErr,
}: loginState) {
  const Auth = new AuthService();
  const { eToken } = useParams();
  const isValidation = window.location.hash.indexOf("email") >= 0;
  const [addUser] = useMutation(ADD_USER);
  const [emailVerify, setEmailVerify] = useState("");

  const validateForm = ({ sPassword, sEmail }: formData) => {
    if (!formSetter) return;
    // Validate each field of the form

    // is this a properly-formed email?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(sEmail)) {
      if (setStrErr) setStrErr("Please provide a valid email address.");
      formSetter({ ...stateObj, sEmail: "" });
      return false;
    }

    // is this a long enough password?
    if (sPassword.length < 8) {
      if (setStrErr)
        setStrErr("Please create a password of at least eight characters");
      formSetter({ ...stateObj, sPassword: "" });
      return false;
    }

    return true;
  };

  const verifyEmail = async (token: string) => {
    // Handler to send the email verification link

    // if there is no email, never mind
    if (!stateObj || !stateObj.sEmail) return;
    try {
      const response = await axios.post("/api/email/validate-send", {
        email: stateObj.sEmail,
      });
      console.log("Email sent successfully!", response.data);
      setEmailVerify(token);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const closeVerifyModal = () => {
    // handles the closure of "confirmation sent", and logs user in
    try {
      // clear the form
      if (formSetter) {
        formSetter({
          sUsername: "",
          sEmail: "",
          sPassword: "",
        });
      }
      Auth.login(emailVerify);
      setEmailVerify("");
      setLogIn(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track value of each signup field

    // if something is amiss and no handler passed down, exit
    if (!handleChange) return;
    handleChange(e);
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    // Handler for submitting signup form

    if (!stateObj || !clear || !formSetter) return;
    e.preventDefault();
    if (
      // return if one of the form fields isn't filled in
      !(stateObj.sUsername && stateObj.sPassword && stateObj.sEmail)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // check username for profanity
    const profane = await axios.get(
      `https://www.purgomalum.com/service/containsprofanity?text=${stateObj.sUsername}`
    );

    if (profane.data) {
      if (setStrErr) setStrErr("Please no profanity in usernames.");
      return;
    }

    // first add the user to the database
    try {
      if (validateForm(stateObj)) {
        // if validated, add the user
        const { data } = await addUser({
          variables: {
            userName: stateObj.sUsername,
            email: stateObj.sEmail,
            password: stateObj.sPassword,
          },
        });

        if (data.addUser.message && setStrErr) {
          setStrErr(data.addUser.message);
          return;
        }

        Auth.login(data.addUser.token);
        setLogIn(true);

        // then send the email verification link
        // verifyEmail(data.addUser.token);
      }
    } catch (err: any) {
      console.log(err);
      // evaluate returned error for type of failure
      if (
        err.message.indexOf("userName") > -1 ||
        err.message.indexOf("lookupName") > -1
      ) {
        if (setStrErr)
          setStrErr(
            `The username "${stateObj.sUsername}" has already been used.`
          );
        formSetter({ ...stateObj, sUsername: "" });
      } else if (err.message.indexOf("email") > -1) {
        if (setStrErr)
          setStrErr(
            `The email address "${stateObj.sEmail}" has already been used.`
          );
        formSetter({ ...stateObj, sEmail: "" });
      } else {
        if (setStrErr) setStrErr("Account creation failed");
        formSetter({
          sUsername: "",
          sEmail: "",
          sPassword: "",
        });
      }
    }
  };

  return (
    <div id="signupFormContainer">
      {isValidation && <EmailTokenModal eToken={eToken} setLogIn={setLogIn} />}
      <h1>Sign Up</h1>

      <form>
        <InputText
          type="text"
          label="username"
          val={stateObj ? stateObj.sUsername : ""}
          max={accountLimits().username_max}
          setValue={handleInputChange}
          capitalize="off"
          id="sUsername"
        />
        <InputText
          type="email"
          label="email"
          val={stateObj ? stateObj.sEmail : ""}
          setValue={handleInputChange}
          id="sEmail"
        />
        <InputText
          type="password"
          label="password"
          val={stateObj ? stateObj.sPassword : ""}
          min={accountLimits().password_min}
          setValue={handleInputChange}
          id="sPassword"
        />
        <button
          type="submit"
          disabled={
            !stateObj ||
            !(
              stateObj.sUsername &&
              stateObj.sPassword &&
              stateObj.sEmail &&
              stateObj.sPassword.length >= accountLimits().password_min
            )
          }
          onClick={handleSignupSubmit}
          className="btn btn-primary"
        >
          Sign up
        </button>
        {strErr && strErr.length > 0 ? (
          <div className="alert alert-danger">{strErr}</div>
        ) : (
          ""
        )}
      </form>
      {emailVerify.length > 0 && (
        <EmailVerifyModal
          close={closeVerifyModal}
          email={stateObj ? stateObj.sEmail : "the provided email address"}
        />
      )}
    </div>
  );
}
