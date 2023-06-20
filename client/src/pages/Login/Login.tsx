import "./Login.css";
import { LoginForm, SignupForm } from "../../components";

export function Login() {
  return (
    <section id="login">
      <LoginForm />
      <SignupForm />
    </section>
  );
}
