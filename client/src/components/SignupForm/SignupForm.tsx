import "./SignupForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils";

export function SignupForm() {
  const [signupForm, setSignupForm] = useState({
    signupUsername: "",
    signupEmail: "",
    signupPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (
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
      const { data } = await addUser({
        variables: {
          userName: signupForm.signupUsername,
          email: signupForm.signupEmail,
          password: signupForm.signupPassword,
        },
      });

      await Auth.login(data.addUser.token);

      setSignupForm({
        signupUsername: "",
        signupEmail: "",
        signupPassword: "",
      });
    } catch (err: any) {
      if (err.message.indexOf("userName") > -1) {
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
