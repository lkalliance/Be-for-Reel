// This component renders the signup form

import "./SignupForm.css";
import { useMutation } from "@apollo/client";
import { AuthService } from "../../utils/auth";
import { loginState } from "../../utils/interfaces";
import { ADD_USER } from "../../utils/mutations";
import { InputText } from "../../components";

interface formData {
  [key: string]: string;
}

export function SignupForm({
  setLogIn,
  stateObj,
  handleChange,
  clear,
  formSetter,
  strErr,
  setStrErr,
}: loginState) {
  const Auth = new AuthService();

  const [addUser] = useMutation(ADD_USER);

  const validateForm = ({ sPassword, sEmail }: formData) => {
    if (!formSetter) return;
    // Validate each field of the form

    // is this a properly-formed email?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(sEmail)) {
      if (setStrErr) setStrErr("Please provide a valid email address.");
      formSetter({ ...stateObj, sEmail: "" });
      return false;
    }

    // is this a long enough password?
    if (sPassword.length < 8) {
      if (setStrErr)
        setStrErr("Please create a password of at least eight characters");
      formSetter({ ...stateObj, sPassword: "" });
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handler to track value of each signup field

    // if something is amiss and no handler passed down, exit
    if (!handleChange) return;
    handleChange(e);
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    // Handler for submitting signup form

    if (!stateObj || !clear || !formSetter) return;
    e.preventDefault();
    if (
      // return if one of the form fields isn't filled in
      !(stateObj.sUsername && stateObj.sPassword && stateObj.sEmail)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    try {
      if (validateForm(stateObj)) {
        // if validated, add the user
        const { data } = await addUser({
          variables: {
            userName: stateObj.sUsername,
            email: stateObj.sEmail,
            password: stateObj.sPassword,
          },
        });

        await Auth.login(data.addUser.token);
        // if the addition successful, show as logged in
        setLogIn(true);

        // clear the form
        formSetter({
          sUsername: "",
          sEmail: "",
          sPassword: "",
        });
      }
    } catch (err: any) {
      // evaluate returned error for type of failure
      if (
        err.message.indexOf("userName") > -1 ||
        err.message.indexOf("lookupName") > -1
      ) {
        if (setStrErr)
          setStrErr(
            `The username "${stateObj.sUsername}" has already been used.`
          );
        formSetter({ ...stateObj, sUsername: "" });
      } else if (err.message.indexOf("email") > -1) {
        if (setStrErr)
          setStrErr(
            `The email address "${stateObj.sEmail}" has already been used.`
          );
        formSetter({ ...stateObj, sEmail: "" });
      } else {
        if (setStrErr) setStrErr("Account creation failed");
        formSetter({
          sUsername: "",
          sEmail: "",
          sPassword: "",
        });
      }
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>

      <form>
        <InputText
          type="text"
          label="username"
          val={stateObj ? stateObj.sUsername : ""}
          max={30}
          setValue={handleInputChange}
          capitalize="off"
          id="sUsername"
        />
        <InputText
          type="email"
          label="email"
          val={stateObj ? stateObj.sEmail : ""}
          setValue={handleInputChange}
          id="sEmail"
        />
        <InputText
          type="password"
          label="password"
          val={stateObj ? stateObj.sPassword : ""}
          min={8}
          setValue={handleInputChange}
          id="sPassword"
        />
        <button
          type="submit"
          disabled={
            !stateObj ||
            !(stateObj.sUsername && stateObj.sPassword && stateObj.sEmail)
          }
          onClick={handleSignupSubmit}
        >
          Submit
        </button>
        {strErr && strErr.length > 0 ? (
          <div className="alert alert-danger">{strErr}</div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
