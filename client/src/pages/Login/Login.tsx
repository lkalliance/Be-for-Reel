// This component renders the login/signup page

import "./Login.css";
import { useState } from "react";
import { LoginForm, SignupForm } from "../../pageComponents";
import { loginState } from "../../utils";

export function Login({ setLogIn }: loginState) {
  const [loginError, setLoginError] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loginForm, setLoginForm] = useState({
    lUsername: "",
    lPassword: "",
  });
  const [signupForm, setSignupForm] = useState({
    sUsername: "",
    sEmail: "",
    sPassword: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields
    const { name, value } = e.target;
    console.log(
      `I'm on the page's login change handler, and the value is ${value}`
    );
    setLoginForm({ ...loginForm, [name]: value });
    setLoginError(false);
    setSignupForm({ sUsername: "", sEmail: "", sPassword: "" });
    setSignupError("");
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    setSignupError("");

    setLoginForm({ lUsername: "", lPassword: "" });
    setLoginError(false);
  };

  const clearForm = (form: string) => {
    if (form === "login") {
      setLoginForm({ lUsername: "", lPassword: "" });
      setLoginError(false);
    } else if (form === "signup") {
      setSignupForm({ sUsername: "", sEmail: "", sPassword: "" });
      setSignupError("");
    }
  };

  return (
    <section id="login">
      <LoginForm
        setLogIn={setLogIn}
        stateObj={loginForm}
        handleChange={handleLoginChange}
        clear={clearForm}
        boolErr={loginError}
        setBoolErr={setLoginError}
      />
      <SignupForm
        setLogIn={setLogIn}
        stateObj={signupForm}
        handleChange={handleSignupChange}
        clear={clearForm}
        strErr={signupError}
        setStrErr={setSignupError}
        formSetter={setSignupForm}
      />
    </section>
  );
}
