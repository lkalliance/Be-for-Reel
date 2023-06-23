import "./LoginForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils";

export function LoginForm() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    // Handles login submission
    e.preventDefault();
    if (!(loginForm.username && loginForm.password)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    try {
      const { data } = await login({
        variables: {
          username: loginForm.username,
          password: loginForm.password,
        },
      });

      await Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
    setLoginForm({
      username: "",
      password: "",
    });
  };

  return (
    <form>
      <label>username</label>
      <input
        type="text"
        placeholder="username"
        id="username"
        onChange={handleInputChange}
      />
      <label>password</label>
      <input
        type="password"
        placeholder="password"
        id="password"
        onChange={handleInputChange}
      />
      <button
        type="submit"
        disabled={!(loginForm.username && loginForm.password)}
        onClick={handleLoginSubmit}
      >
        Submit
      </button>
    </form>
  );
}
