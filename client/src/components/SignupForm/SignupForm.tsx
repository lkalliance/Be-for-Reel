// This component renders the signup form

import "./SignupForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { ADD_USER } from "../../utils";
import { loginState } from "../../utils/interfaces";

interface formData {
  signupUsername: string;
  signupEmail: string;
  signupPassword: string;
}

export function SignupForm({ setLogIn }: loginState) {
  const Auth = new AuthService();
  const [signupForm, setSignupForm] = useState({
    signupUsername: "",
    signupEmail: "",
    signupPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [addUser] = useMutation(ADD_USER);

  const validateForm = ({ signupPassword, signupEmail }: formData) => {
    // Validate each field of the form

    // is this a properly-formed email?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(signupEmail)) {
      setErrorMessage("Please provide a valid email address.");
      setSignupForm({ ...signupForm, signupEmail: "" });
      return false;
    }

    // is this a long enough password?
    if (signupPassword.length < 8) {
      setErrorMessage("Please create a password of at least eight characters");
      setSignupForm({ ...signupForm, signupPassword: "" });
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track value of each signup field
    setErrorMessage("");
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    // Handler for submitting signup form

    e.preventDefault();
    if (
      // return if one of the form fields isn't filled in
      !(
        signupForm.signupUsername &&
        signupForm.signupPassword &&
        signupForm.signupEmail
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    try {
      if (validateForm(signupForm)) {
        // if validated, add the user
        const { data } = await addUser({
          variables: {
            userName: signupForm.signupUsername,
            email: signupForm.signupEmail,
            password: signupForm.signupPassword,
          },
        });

        await Auth.login(data.addUser.token);
        // if the addition successful, show as logged in
        setLogIn(true);

        // clear the form
        setSignupForm({
          signupUsername: "",
          signupEmail: "",
          signupPassword: "",
        });
      }
    } catch (err: any) {
      // evaluate returned error for type of failure
      if (
        err.message.indexOf("userName") > -1 ||
        err.message.indexOf("lookupName") > -1
      ) {
        setErrorMessage(
          `The username "${signupForm.signupUsername}" has already been used.`
        );
        setSignupForm({ ...signupForm, signupUsername: "" });
      } else if (err.message.indexOf("email") > -1) {
        setErrorMessage(
          `The email address "${signupForm.signupEmail}" has already been used.`
        );
        setSignupForm({ ...signupForm, signupEmail: "" });
      } else {
        setErrorMessage("Account creation failed");
        setSignupForm({
          signupUsername: "",
          signupEmail: "",
          signupPassword: "",
        });
      }
    }
  };

  return (
    <form>
      <label>username</label>
      <input
        type="text"
        placeholder="username"
        id="signupUsername"
        name="signupUsername"
        value={signupForm.signupUsername}
        onChange={handleInputChange}
      />
      <label>email</label>
      <input
        type="text"
        placeholder="email@sample.com"
        id="signupEmail"
        name="signupEmail"
        value={signupForm.signupEmail}
        onChange={handleInputChange}
      />
      <label>password</label>
      <input
        type="password"
        placeholder="password"
        id="signupPassword"
        name="signupPassword"
        value={signupForm.signupPassword}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        disabled={
          !(
            signupForm.signupUsername &&
            signupForm.signupPassword &&
            signupForm.signupEmail
          )
        }
        onClick={handleSignupSubmit}
      >
        Submit
      </button>
      {errorMessage.length > 0 ? (
        <div className="alert alert-danger">{errorMessage}</div>
      ) : (
        ""
      )}
    </form>
  );
}
