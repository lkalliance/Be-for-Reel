// This component renders the login form

import "./LoginForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils";
import { loginState } from "../../utils/interfaces";

export function LoginForm({ setLogIn }: loginState) {
  const [loginForm, setLoginForm] = useState({
    loginUsername: "",
    loginPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [login, { error, data }] = useMutation(LOGIN);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields
    setErrorMessage(false);
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    // Handler for login submission
    e.preventDefault();
    if (!(loginForm.loginUsername && loginForm.loginPassword)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setLoginForm({
      loginUsername: "",
      loginPassword: "",
    });

    try {
      const { data } = await login({
        variables: {
          userName: loginForm.loginUsername,
          password: loginForm.loginPassword,
        },
      });
      console.log(data.login);
      await Auth.login(data.login.token);
      setLogIn(true);
    } catch (err) {
      setErrorMessage(true);
      console.log(err);
    }
  };

  return (
    <form>
      <label>username</label>
      <input
        type="text"
        placeholder="username"
        id="loginUsername"
        name="loginUsername"
        value={loginForm.loginUsername}
        onChange={handleInputChange}
      />
      <label>password</label>
      <input
        type="password"
        placeholder="password"
        id="loginPassword"
        name="loginPassword"
        value={loginForm.loginPassword}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        disabled={!(loginForm.loginUsername && loginForm.loginPassword)}
        onClick={handleLoginSubmit}
      >
        Submit
      </button>
      {errorMessage ? (
        <div className="alert alert-danger">Incorrect login credentials</div>
      ) : (
        ""
      )}
    </form>
  );
}
