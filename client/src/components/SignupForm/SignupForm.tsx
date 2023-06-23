import "./SignupForm.css";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils";

export function SignupForm() {
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    console.log(signupForm);
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    // Handles signup submission
    e.preventDefault();
    // if (!(signupForm.username && signupForm.password && signupForm.email)) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   return;
    // }

    try {
      const { data } = await addUser({
        variables: {
          userName: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
        },
      });

      console.log(data);

      await Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
    setSignupForm({
      username: "",
      email: "",
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
        name="username"
        onChange={handleInputChange}
      />
      <label>email</label>
      <input
        type="text"
        placeholder="email@sample.com"
        id="email"
        name="email"
        onChange={handleInputChange}
      />
      <label>password</label>
      <input
        type="password"
        placeholder="password"
        id="password"
        name="password"
        onChange={handleInputChange}
      />
      <button type="submit" onClick={handleSignupSubmit}>
        Submit
      </button>
    </form>
  );
}
