// This component renders the login form

import "./LoginForm.css";
import { useMutation } from "@apollo/client";
import { loginState } from "../../utils/interfaces";
import { LOGIN } from "../../utils/mutations";
import { AuthService } from "../../utils/auth";
import { InputText } from "../../components";

export function LoginForm({
  setLogIn,
  stateObj,
  handleChange,
  clear,
  boolErr,
  setBoolErr,
}: loginState) {
  const Auth = new AuthService();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { error, data }] = useMutation(LOGIN);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler for changes to login fields

    // if something is amiss and no handler passed down, exit
    if (!handleChange) return;
    handleChange(e);
    console.log(stateObj);
  };

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    // Handler for login submission
    e.preventDefault();
    if (!stateObj) return;
    if (!(stateObj.lUsername && stateObj.lPassword)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Clear the login form
    if (clear) clear("login");

    try {
      const { data } = await login({
        variables: {
          userName: stateObj.lUsername,
          password: stateObj.lPassword,
        },
      });

      // store the login token
      Auth.login(data.login.token);
      setLogIn(true);
    } catch (err) {
      if (clear) clear("login");
      if (setBoolErr) setBoolErr(true);
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Log in</h1>
      <form>
        <label>username or email</label>
        <InputText
          type="text"
          val={stateObj ? stateObj.lUsername : ""}
          setValue={handleInputChange}
          capitalize="off"
          id="lUsername"
        />
        <label>password</label>
        <InputText
          type="password"
          val={stateObj ? stateObj.lPassword : ""}
          setValue={handleInputChange}
          id="lPassword"
        />
        <button
          type="submit"
          disabled={
            stateObj ? !(stateObj.lUsername && stateObj.lPassword) : false
          }
          onClick={handleLoginSubmit}
        >
          Submit
        </button>
        {boolErr ? (
          <div className="alert alert-danger">Incorrect login credentials</div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
