// This component renders the login/signup page

import "./Login.css";
import { useState } from "react";
import { loginState } from "../../utils/interfaces";
import { LoginForm, SignupForm } from "../../pageComponents";

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
    <section id="login" className="container">
      <div className="row">
        <div className="col col-12 col-sm-6">
          <LoginForm
            setLogIn={setLogIn}
            stateObj={loginForm}
            handleChange={handleLoginChange}
            clear={clearForm}
            boolErr={loginError}
            setBoolErr={setLoginError}
          />
        </div>
        <div className="col col-12 col-sm-6">
          <SignupForm
            setLogIn={setLogIn}
            stateObj={signupForm}
            handleChange={handleSignupChange}
            clear={clearForm}
            strErr={signupError}
            setStrErr={setSignupError}
            formSetter={setSignupForm}
          />
        </div>
      </div>
    </section>
  );
}
