import "./Login.css";
import { LoginForm, SignupForm } from "../../components";
import { loginState } from "../../utils/interfaces";

export function Login({ setLogIn }: loginState) {
  return (
    <section id="login">
      <LoginForm setLogIn={setLogIn} />
      <SignupForm setLogIn={setLogIn} />
    </section>
  );
}
