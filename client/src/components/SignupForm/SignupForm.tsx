import "./SignupForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ApolloError } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils";

export function SignupForm() {
  const [signupForm, setSignupForm] = useState({
    signupUsername: "",
    signupEmail: "",
    signupPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(false);
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    // Handles signup submission
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
    } catch (err) {
      setErrorMessage(true);
      console.log(err);
    }
    setSignupForm({
      signupUsername: "",
      signupEmail: "",
      signupPassword: "",
    });
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
      {errorMessage ? <div className="alert alert-danger">Failed</div> : ""}
    </form>
  );
}
